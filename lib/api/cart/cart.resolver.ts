import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart, CartItem } from './cart.entity';
import {
  CreateCartInput,
  AddCartItemInput,
  UpdateCartItemInput,
  ApplyDiscountInput,
} from './cart.dtos';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Query(() => Cart)
  async cart(@Args('id', { type: () => ID }) id: string) {
    return this.cartService.getCart(id);
  }

  @Mutation(() => Cart)
  async createCart(@Args('input') input: CreateCartInput) {
    return this.cartService.createCart(input);
  }

  @Mutation(() => CartItem)
  async addCartItem(@Args('input') input: AddCartItemInput) {
    return this.cartService.addCartItem(input);
  }

  @Mutation(() => CartItem)
  async updateCartItem(@Args('input') input: UpdateCartItemInput) {
    return this.cartService.updateCartItem(input);
  }

  @Mutation(() => Boolean)
  async removeCartItem(@Args('id', { type: () => ID }) id: string) {
    return this.cartService.removeCartItem(id);
  }

  @Mutation(() => Cart)
  async applyDiscount(@Args('input') input: ApplyDiscountInput) {
    return this.cartService.applyDiscount(input);
  }
}
