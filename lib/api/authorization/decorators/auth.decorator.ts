import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/api/authentication/guard/jwt-auth.guard';
import { StoreOwnerGuard } from '../guards/store-owner.guard';
import { ProductOwnerGuard } from '../guards/product-owner.guard';
import { CategoryOwnerGuard } from '../guards/category-owner.guard';
import { CollectionOwnerGuard } from '../guards/collection-owner.guard';

export function Auth(...guards: any[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, ...guards));
}

export const AuthStore = () => Auth(StoreOwnerGuard);
export const AuthProduct = () => Auth(ProductOwnerGuard);
export const AuthCategory = () => Auth(CategoryOwnerGuard);
export const AuthCollection = () => Auth(CollectionOwnerGuard);
