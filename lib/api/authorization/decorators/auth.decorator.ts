import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/api/authentication/guard/jwt-auth.guard';
import { StoreOwnerGuard } from '../guards/store-owner.guard';
import { ProductOwnerGuard } from '../guards/product-owner.guard';
import { CategoryOwnerGuard } from '../guards/category-owner.guard';
import { CollectionOwnerGuard } from '../guards/collection-owner.guard';
import { BulkProductOwnerGuard } from '../guards/bulk-product-owner.guard';
import { BulkStoreOwnerGuard } from '../guards/bulk-store-owner.guard';
import { BulkCategoryOwnerGuard } from '../guards/bulk-category-owner.guard';
import { BulkCollectionOwnerGuard } from '../guards/bulk-collection-owner.guard';

export function Auth(...guards: any[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, ...guards));
}

export const AuthStore = () => Auth(StoreOwnerGuard);
export const AuthProduct = () => Auth(ProductOwnerGuard);
export const AuthCategory = () => Auth(CategoryOwnerGuard);
export const AuthCollection = () => Auth(CollectionOwnerGuard);
export const AuthBulkProducts = () => Auth(BulkProductOwnerGuard);
export const AuthBulkStores = () => Auth(BulkStoreOwnerGuard);
export const AuthBulkCategories = () => Auth(BulkCategoryOwnerGuard);
export const AuthBulkCollections = () => Auth(BulkCollectionOwnerGuard);
