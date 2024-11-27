import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import { StoreService } from '../store/store.service';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  ShipmentStatus,
  Prisma,
} from '@prisma/client';
import { OrderCreateInput, OrderFiltersInput } from './order.dto';
import { paginate } from '@/api/pagination/paginate';
import { PaginationArgs } from '@/api/pagination/pagination.args';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storeService: StoreService
  ) {}

  private async generateOrderNumber(storeId: string): Promise<string> {
    const orderCount = await this.prisma.order.count({
      where: { storeId },
    });

    return (orderCount + 1).toString().padStart(6, '0');
  }

  getFormattedOrderNumber(order: Pick<Order, 'orderNumber'>, store: { orderPrefix?: string | null; orderSuffix?: string | null }): string {
    const prefix = store.orderPrefix || '';
    const suffix = store.orderSuffix || '';
    return `${prefix}${order.orderNumber}${suffix}`;
  }

  async createDraftOrder(input: OrderCreateInput): Promise<Order> {
    const store = await this.storeService.getStoreById(input.storeId);
    if (!store) {
      throw new BadRequestException(`Store with ID ${input.storeId} not found`);
    }

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
            taxAmount: new Prisma.Decimal(0), // Tax calculation to be implemented
            discountAmount: new Prisma.Decimal(0), // Discount calculation to be implemented
            totalAmount: subtotal, // Will be adjusted when tax/discount is implemented
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
            storeId: input.storeId,
            customerId: input.customerId,
            items: {
              create: orderItems,
            },
          },
          include: {
            items: true,
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
        ...(filters?.paymentStatus && { paymentStatus: { in: filters.paymentStatus } }),
        ...(filters?.shipmentStatus && { shipmentStatus: { in: filters.shipmentStatus } }),
        ...(filters?.customerId && { customerId: filters.customerId }),
        ...(filters?.searchQuery && {
          OR: [
            { orderNumber: { contains: filters.searchQuery, mode: 'insensitive' } },
            { customerNotes: { contains: filters.searchQuery, mode: 'insensitive' } },
            { privateNotes: { contains: filters.searchQuery, mode: 'insensitive' } },
            { customer: {
              OR: [
                { firstName: { contains: filters.searchQuery, mode: 'insensitive' } },
                { lastName: { contains: filters.searchQuery, mode: 'insensitive' } },
                { email: { contains: filters.searchQuery, mode: 'insensitive' } },
              ]
            }},
            { items: {
              some: {
                OR: [
                  { title: { contains: filters.searchQuery, mode: 'insensitive' } },
                  { sku: { contains: filters.searchQuery, mode: 'insensitive' } },
                ]
              }
            }}
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
      const [
        total,
        draft,
        pending,
        processing,
        shipped,
        delivered,
        cancelled
      ] = await Promise.all([
        this.prisma.order.count({ where: { storeId } }),
        this.prisma.order.count({ where: { storeId, status: 'DRAFT' } }),
        this.prisma.order.count({ where: { storeId, status: 'PENDING' } }),
        this.prisma.order.count({ where: { storeId, status: 'PROCESSING' } }),
        this.prisma.order.count({ where: { storeId, status: 'SHIPPED' } }),
        this.prisma.order.count({ where: { storeId, status: 'DELIVERED' } }),
        this.prisma.order.count({ where: { storeId, status: 'CANCELLED' } })
      ]);

      const totals = await this.prisma.order.aggregate({
        where: { 
          storeId,
          status: { not: 'DRAFT' }
        },
        _sum: {
          totalAmount: true,
          taxAmount: true,
          shippingAmount: true,
          discountAmount: true
        }
      });

      return {
        counts: {
          total,
          draft,
          pending,
          processing,
          shipped,
          delivered,
          cancelled
        },
        totals: {
          orders: totals._sum.totalAmount?.toNumber() || 0,
          tax: totals._sum.taxAmount?.toNumber() || 0,
          shipping: totals._sum.shippingAmount?.toNumber() || 0,
          discounts: totals._sum.discountAmount?.toNumber() || 0
        }
      };
    } catch (error) {
      this.logger.error(`Error fetching order stats for store ${storeId}:`, error);
      throw error;
    }
  }
}
