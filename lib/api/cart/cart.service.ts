import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem } from './cart.entity';
import {
  CreateCartInput,
  AddCartItemInput,
  UpdateCartItemInput,
  ApplyDiscountInput,
} from './cart.dtos';
import {
  CartStatus,
  DiscountType,
  Cart as CartModel,
  CartItem as CartItemModel,
  CartDiscount as CartDiscountModel,
  MediaOwnerType,
} from '@prisma/client';
import { PrismaService } from '@/lib/common/prisma/prisma.service';
import { DEFAULT_CURRENCY_SYMBOLS } from '@/common/constants';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private convertDecimalCart(
    cart: CartModel & { items: CartItemModel[]; discounts: CartDiscountModel[] }
  ): Cart {
    return {
      ...cart,
      subtotalAmount: Number(cart.subtotalAmount),
      taxAmount: Number(cart.taxAmount),
      shippingAmount: Number(cart.shippingAmount),
      discountAmount: Number(cart.discountAmount),
      totalAmount: Number(cart.totalAmount),
      items: cart.items.map((item) => this.convertDecimalCartItem(item)),
      discounts: cart.discounts.map((discount) => ({
        ...discount,
        amount: Number(discount.amount),
      })),
    };
  }

  private convertDecimalCartItem(item: CartItemModel): CartItem {
    return {
      ...item,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
      taxAmount: Number(item.taxAmount),
      discountAmount: Number(item.discountAmount),
      totalAmount: Number(item.totalAmount),
    };
  }

  async createCart(input: CreateCartInput): Promise<Cart> {
    const store = await this.prisma.store.findUnique({
      where: { id: input.storeId },
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${input.storeId} not found`);
    }

    return this.convertDecimalCart(
      await this.prisma.cart.create({
        data: {
          status: CartStatus.ACTIVE,
          store: { connect: { id: input.storeId } },
          customer: input.customerId
            ? { connect: { id: input.customerId } }
            : undefined,
          email: input.email,
          phoneNumber: input.phoneNumber,
          notes: input.notes,
          currency: store.currency,
          currencySymbol: store.currencySymbol || DEFAULT_CURRENCY_SYMBOLS[store.currency],
        },
        include: {
          items: true,
          discounts: true,
        },
      })
    );
  }

  async getCart(id: string): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: {
        items: true,
        discounts: true,
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return this.convertDecimalCart(cart);
  }

  async addCartItem(input: AddCartItemInput): Promise<CartItem> {
    const product = await this.prisma.product.findUnique({
      where: { id: input.productId },
      include: {
        variants: input.variantId
          ? {
              where: { id: input.variantId },
            }
          : undefined,
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${input.productId} not found`
      );
    }

    const variant = input.variantId
      ? product.variants.find((v) => v.id === input.variantId)
      : null;
    if (input.variantId && !variant) {
      throw new NotFoundException(
        `Variant with ID ${input.variantId} not found`
      );
    }

    const price = Number(variant ? variant.price : product.variants[0].price);
    const subtotal = price * input.quantity;

    const [productMediaOwner, productVariantMediaOwner] = await Promise.all([
      this.prisma.mediaOwnership.findFirst({
        where: {
          ownerId: product.id,
          ownerType: MediaOwnerType.PRODUCT,
        },
        orderBy: { position: 'asc' },
        include: { media: true },
      }),
      this.prisma.mediaOwnership.findFirst({
        where: {
          ownerId: variant!.id,
          ownerType: MediaOwnerType.PRODUCT_VARIANT,
        },
        orderBy: { position: 'asc' },
        include: { media: true },
      }),
    ]);

    const cartItem = await this.prisma.cartItem.create({
      data: {
        cart: { connect: { id: input.cartId } },
        productId: product.id,
        variantId: variant!.id,
        title: product.title,
        variantName: variant ? variant.optionCombination.join(' / ') : null,
        sku: variant?.sku,
        unitPrice: price,
        quantity: input.quantity,
        subtotal,
        taxAmount: 0, // Calculate based on your tax logic
        discountAmount: 0,
        totalAmount: subtotal,
        previewImageUrl:
          productVariantMediaOwner?.media?.url || productMediaOwner?.media?.url,
      },
    });

    await this.updateCartTotals(input.cartId);
    return this.convertDecimalCartItem(cartItem);
  }

  async updateCartItem(input: UpdateCartItemInput): Promise<CartItem> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: input.cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Cart item with ID ${input.cartItemId} not found`
      );
    }

    const subtotal = Number(cartItem.unitPrice) * input.quantity;
    const updated = await this.prisma.cartItem.update({
      where: { id: input.cartItemId },
      data: {
        quantity: input.quantity,
        subtotal,
        totalAmount: subtotal - Number(cartItem.discountAmount),
      },
    });

    await this.updateCartTotals(cartItem.cartId);
    return this.convertDecimalCartItem(updated);
  }

  async removeCartItem(id: string): Promise<boolean> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    await this.prisma.cartItem.delete({
      where: { id },
    });

    await this.updateCartTotals(cartItem.cartId);
    return true;
  }

  async applyDiscount(input: ApplyDiscountInput): Promise<Cart> {
    // Implement your discount validation and application logic here
    return this.convertDecimalCart(
      await this.prisma.cart.update({
        where: { id: input.cartId },
        data: {
          discounts: {
            create: {
              code: input.code,
              type: DiscountType.PERCENTAGE,
              amount: 10.0, // Example amount
              applied: true,
            },
          },
        },
        include: {
          items: true,
          discounts: true,
        },
      })
    );
  }

  private async updateCartTotals(cartId: string): Promise<void> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: true,
        discounts: true,
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    const subtotalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );
    const discountAmount = cart.discounts.reduce((sum, discount) => {
      if (discount.type === DiscountType.PERCENTAGE) {
        return sum + (subtotalAmount * Number(discount.amount)) / 100;
      }
      return sum + Number(discount.amount);
    }, 0);

    await this.prisma.cart.update({
      where: { id: cartId },
      data: {
        subtotalAmount,
        discountAmount,
        totalAmount:
          Number(subtotalAmount) -
          Number(discountAmount) +
          Number(cart.taxAmount) +
          Number(cart.shippingAmount),
        lastActivityAt: new Date(),
      },
    });
  }
}
