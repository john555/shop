import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/lib/common/prisma/prisma.service';
import { StoreService } from '@/lib/admin-api/store/store.service';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  ShipmentStatus,
  Prisma,
} from '@prisma/client';
import {
  OrderCreateInput,
  OrderFiltersInput,
  OrderUpdateInput,
} from './order.dto';
import { paginate } from '@/lib/common/backend/pagination/paginate';
import { PaginationArgs } from '@/lib/common/backend/pagination/pagination.args';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storeService: StoreService
  ) {}

  private async validateCustomer(
    customerId: string | undefined,
    storeId: string
  ): Promise<void> {
    if (!customerId) return;

    const customer = await this.prisma.customer.findFirst({
      where: {
        id: customerId,
        storeId,
      },
    });

    if (!customer) {
      throw new BadRequestException(
        `Customer with ID ${customerId} not found in store ${storeId}`
      );
    }
  }

  private async generateOrderNumber(storeId: string): Promise<string> {
    const orderCount = await this.prisma.order.count({
      where: { storeId },
    });

    return (orderCount + 1).toString().padStart(6, '0');
  }

  async createDraftOrder(input: OrderCreateInput): Promise<Order> {
    const store = await this.storeService.getStoreById(input.storeId);
    if (!store) {
      throw new BadRequestException(`Store with ID ${input.storeId} not found`);
    }

    // Validate customer if provided
    await this.validateCustomer(input.customerId, input.storeId);

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Fetch all product variants
        const variants = await tx.productVariant.findMany({
          where: {
            id: { in: input.items.map((item) => item.variantId) },
            product: {
              storeId: input.storeId,
              id: { in: input.items.map((item) => item.productId) },
            },
          },
          include: {
            product: {
              select: { id: true, title: true },
            },
          },
        });

        // Validate variants
        const variantMap = new Map(variants.map((v) => [v.id, v]));
        input.items.forEach((item) => {
          const variant = variantMap.get(item.variantId);
          if (!variant) {
            throw new BadRequestException(
              `Invalid variant ID: ${item.variantId}`
            );
          }
          if (variant.product.id !== item.productId) {
            throw new BadRequestException(
              `Variant ${item.variantId} does not belong to product ${item.productId}`
            );
          }
        });

        // Calculate order items
        const orderItems = input.items.map((item) => {
          const variant = variantMap.get(item.variantId)!;
          const subtotal = variant.price.mul(item.quantity);

          return {
            productId: item.productId,
            variantId: item.variantId,
            title: variant.product.title,
            variantName: variant.optionCombination.join(' / '),
            sku: variant.sku,
            unitPrice: variant.price,
            quantity: item.quantity,
            subtotal,
            taxAmount: new Prisma.Decimal(0),
            discountAmount: new Prisma.Decimal(0),
            totalAmount: subtotal,
          };
        });

        // Calculate order totals
        const subtotalAmount = orderItems.reduce(
          (sum, item) => sum.add(item.subtotal),
          new Prisma.Decimal(0)
        );

        // Generate order number
        const orderNumber = await this.generateOrderNumber(input.storeId);

        // Create order with items
        const order = await tx.order.create({
          data: {
            orderNumber,
            status: OrderStatus.DRAFT,
            paymentStatus: PaymentStatus.PENDING,
            shipmentStatus: ShipmentStatus.PENDING,
            subtotalAmount,
            taxAmount: new Prisma.Decimal(0),
            shippingAmount: new Prisma.Decimal(0),
            discountAmount: new Prisma.Decimal(0),
            totalAmount: subtotalAmount,
            currency: store.currency,
            currencySymbol:
              store.currencySymbol ||
              this.storeService.getDefaultCurrencySymbol(store.currency),
            customerNotes: input.customerNotes,
            privateNotes: input.privateNotes,
            store: {
              connect: {
                id: input.storeId,
              },
            },
            ...(input.customerId
              ? {
                  customer: {
                    connect: {
                      id: input.customerId,
                    },
                  },
                }
              : {}),
            items: {
              create: orderItems,
            },
          },
          include: {
            items: true,
            customer: true,
          },
        });

        return order;
      });
    } catch (error) {
      this.logger.error('Failed to create draft order:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async findOrderStore(orderId: string) {
    return this.prisma.store.findFirstOrThrow({
      where: {
        orders: {
          some: { id: orderId },
        },
      },
    });
  }

  async findOrderCustomer(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { customerId: true },
    });

    if (!order?.customerId) return null;

    return this.prisma.customer.findUnique({
      where: { id: order.customerId },
    });
  }

  async findOrderItems(orderId: string) {
    return this.prisma.orderItem.findMany({
      where: { orderId },
    });
  }

  async findByStore(
    storeId: string,
    args?: PaginationArgs,
    filters?: OrderFiltersInput
  ): Promise<Order[]> {
    try {
      const where: Prisma.OrderWhereInput = {
        storeId,
        ...(filters?.status && { status: { in: filters.status } }),
        ...(filters?.paymentStatus && {
          paymentStatus: { in: filters.paymentStatus },
        }),
        ...(filters?.shipmentStatus && {
          shipmentStatus: { in: filters.shipmentStatus },
        }),
        ...(filters?.customerId && { customerId: filters.customerId }),
        ...(filters?.searchQuery && {
          OR: [
            {
              orderNumber: {
                contains: filters.searchQuery,
                mode: 'insensitive',
              },
            },
            {
              customerNotes: {
                contains: filters.searchQuery,
                mode: 'insensitive',
              },
            },
            {
              privateNotes: {
                contains: filters.searchQuery,
                mode: 'insensitive',
              },
            },
            {
              customer: {
                OR: [
                  {
                    firstName: {
                      contains: filters.searchQuery,
                      mode: 'insensitive',
                    },
                  },
                  {
                    lastName: {
                      contains: filters.searchQuery,
                      mode: 'insensitive',
                    },
                  },
                  {
                    email: {
                      contains: filters.searchQuery,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
            {
              items: {
                some: {
                  OR: [
                    {
                      title: {
                        contains: filters.searchQuery,
                        mode: 'insensitive',
                      },
                    },
                    {
                      sku: {
                        contains: filters.searchQuery,
                        mode: 'insensitive',
                      },
                    },
                  ],
                },
              },
            },
          ],
        }),
        ...(filters?.minAmount && {
          totalAmount: { gte: new Prisma.Decimal(filters.minAmount) },
        }),
        ...(filters?.maxAmount && {
          totalAmount: { lte: new Prisma.Decimal(filters.maxAmount) },
        }),
        ...(filters?.startDate && {
          createdAt: { gte: filters.startDate },
        }),
        ...(filters?.endDate && {
          createdAt: { lte: filters.endDate },
        }),
      };

      return paginate({
        modelDelegate: this.prisma.order,
        args,
        where,
        include: {
          items: true,
          customer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(`Error fetching orders for store ${storeId}:`, error);
      throw error;
    }
  }

  async getStoreOrderStats(storeId: string) {
    try {
      const [total, draft, pending, processing, shipped, delivered, cancelled] =
        await Promise.all([
          this.prisma.order.count({ where: { storeId } }),
          this.prisma.order.count({ where: { storeId, status: 'DRAFT' } }),
          this.prisma.order.count({ where: { storeId, status: 'PENDING' } }),
          this.prisma.order.count({ where: { storeId, status: 'PROCESSING' } }),
          this.prisma.order.count({ where: { storeId, status: 'SHIPPED' } }),
          this.prisma.order.count({ where: { storeId, status: 'DELIVERED' } }),
          this.prisma.order.count({ where: { storeId, status: 'CANCELLED' } }),
        ]);

      const totals = await this.prisma.order.aggregate({
        where: {
          storeId,
          status: { not: 'DRAFT' },
        },
        _sum: {
          totalAmount: true,
          taxAmount: true,
          shippingAmount: true,
          discountAmount: true,
        },
      });

      return {
        counts: {
          total,
          draft,
          pending,
          processing,
          shipped,
          delivered,
          cancelled,
        },
        totals: {
          orders: totals._sum.totalAmount?.toNumber() || 0,
          tax: totals._sum.taxAmount?.toNumber() || 0,
          shipping: totals._sum.shippingAmount?.toNumber() || 0,
          discounts: totals._sum.discountAmount?.toNumber() || 0,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error fetching order stats for store ${storeId}:`,
        error
      );
      throw error;
    }
  }

  private determineOrderStatus(
    currentStatus: OrderStatus,
    paymentStatus?: PaymentStatus,
    shipmentStatus?: ShipmentStatus
  ): OrderStatus | undefined {
    // Don't change status if order is a draft or refunded
    if (
      [OrderStatus.DRAFT, OrderStatus.REFUNDED].includes(currentStatus as any)
    ) {
      return undefined;
    }

    // Payment status transitions
    if (paymentStatus === PaymentStatus.COMPLETED) {
      return OrderStatus.PROCESSING;
    }
    if (paymentStatus === PaymentStatus.PENDING) {
      return OrderStatus.PENDING;
    }

    // Shipment status transitions
    if (shipmentStatus === ShipmentStatus.SHIPPED) {
      return OrderStatus.SHIPPED;
    }
    if (shipmentStatus === ShipmentStatus.DELIVERED) {
      return OrderStatus.DELIVERED;
    }

    return undefined;
  }

  async update(input: OrderUpdateInput): Promise<Order> {
    const existingOrder = await this.findById(input.id);
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${input.id} not found`);
    }

    // Determine new order status based on payment/shipment status changes
    const determinedStatus = this.determineOrderStatus(
      existingOrder.status,
      input.paymentStatus,
      input.shipmentStatus
    );

    // Combine explicitly set status with determined status
    const newStatus = input.status || determinedStatus;

    // Validate status transitions if there's a status change
    if (newStatus && newStatus !== existingOrder.status) {
      this.validateStatusTransition(existingOrder.status, newStatus);
    }

    // Validate customer if provided
    if (input.customerId) {
      await this.validateCustomer(input.customerId, existingOrder.storeId);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Handle item updates
        if (input.updateItems?.length) {
          await Promise.all(
            input.updateItems.map((item) =>
              tx.orderItem.update({
                where: {
                  id: item.id,
                  orderId: input.id,
                },
                data: {
                  quantity: item.quantity,
                },
              })
            )
          );
        }

        // Handle item removals
        if (input.removeItems?.length) {
          await tx.orderItem.deleteMany({
            where: {
              id: { in: input.removeItems },
              orderId: input.id,
            },
          });
        }

        // Handle new items
        if (input.addItems?.length) {
          // Fetch and validate new variants
          const variants = await tx.productVariant.findMany({
            where: {
              id: { in: input.addItems.map((item) => item.variantId) },
              product: {
                storeId: existingOrder.storeId,
                id: { in: input.addItems.map((item) => item.productId) },
              },
            },
            include: {
              product: {
                select: { id: true, title: true },
              },
            },
          });

          // Validate variants
          const variantMap = new Map(variants.map((v) => [v.id, v]));
          input.addItems.forEach((item) => {
            const variant = variantMap.get(item.variantId);
            if (!variant) {
              throw new BadRequestException(
                `Invalid variant ID: ${item.variantId}`
              );
            }
            if (variant.product.id !== item.productId) {
              throw new BadRequestException(
                `Variant ${item.variantId} does not belong to product ${item.productId}`
              );
            }
          });

          // Create new items
          const newOrderItems = input.addItems.map((item) => {
            const variant = variantMap.get(item.variantId)!;
            const subtotal = variant.price.mul(item.quantity);

            return {
              productId: item.productId,
              variantId: item.variantId,
              title: variant.product.title,
              variantName: variant.optionCombination.join(' / '),
              sku: variant.sku,
              unitPrice: variant.price,
              quantity: item.quantity,
              subtotal,
              taxAmount: new Prisma.Decimal(0),
              discountAmount: new Prisma.Decimal(0),
              totalAmount: subtotal,
              orderId: input.id,
            };
          });

          await tx.orderItem.createMany({
            data: newOrderItems,
          });
        }

        // Calculate new totals
        const updatedItems = await tx.orderItem.findMany({
          where: { orderId: input.id },
        });

        const subtotalAmount = updatedItems.reduce(
          (sum, item) => sum.add(item.subtotal),
          new Prisma.Decimal(0)
        );

        // Prepare timestamp updates
        const timestampUpdates: Prisma.OrderUpdateInput = {};
        if (
          (input.status === OrderStatus.CANCELLED ||
            newStatus === OrderStatus.CANCELLED) &&
          !existingOrder.cancelledAt
        ) {
          timestampUpdates.cancelledAt = new Date();
        }
        if (
          input.paymentStatus === PaymentStatus.COMPLETED &&
          !existingOrder.paidAt
        ) {
          timestampUpdates.paidAt = new Date();
        }
        if (input.paymentStatus === PaymentStatus.PENDING) {
          timestampUpdates.paidAt = null;
        }
        if (
          input.shipmentStatus === ShipmentStatus.SHIPPED &&
          !existingOrder.shippedAt
        ) {
          timestampUpdates.shippedAt = new Date();
        }
        if (
          input.shipmentStatus === ShipmentStatus.DELIVERED &&
          !existingOrder.deliveredAt
        ) {
          timestampUpdates.deliveredAt = new Date();
        }

        // Prepare customer update
        const customerUpdate: Prisma.OrderUpdateInput = input.customerId
          ? {
              customer: {
                connect: { id: input.customerId },
              },
            }
          : {};

        // Update the order
        const updatedOrder = await tx.order.update({
          where: { id: input.id },
          data: {
            // Use determined or explicitly set status
            ...(newStatus && { status: newStatus }),
            ...(input.paymentStatus && { paymentStatus: input.paymentStatus }),
            ...(input.shipmentStatus && {
              shipmentStatus: input.shipmentStatus,
            }),
            ...(input.customerNotes !== undefined && {
              customerNotes: input.customerNotes,
            }),
            ...(input.privateNotes !== undefined && {
              privateNotes: input.privateNotes,
            }),
            ...(input.trackingNumber !== undefined && {
              trackingNumber: input.trackingNumber,
            }),
            ...(input.trackingUrl !== undefined && {
              trackingUrl: input.trackingUrl,
            }),
            subtotalAmount,
            totalAmount: subtotalAmount,
            ...timestampUpdates,
            ...customerUpdate,
          },
          include: {
            items: true,
            customer: true,
          },
        });

        return updatedOrder;
      });
    } catch (error) {
      this.logger.error(`Failed to update order ${input.id}:`, error);
      throw error;
    }
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ) {
    // Define valid status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.DRAFT]: [OrderStatus.PENDING, OrderStatus.CANCELLED],
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [OrderStatus.CANCELLED],
      [OrderStatus.CANCELLED]: [], // No transitions allowed from cancelled
      [OrderStatus.REFUNDED]: [], // No transitions allowed from refunded
      [OrderStatus.PAID]: [],
      [OrderStatus.FULFILLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }
}
