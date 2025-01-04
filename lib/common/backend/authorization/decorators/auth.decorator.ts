import { applyDecorators, UseGuards } from '@nestjs/common';
import { StoreOwnerGuard } from '../guards/store-owner.guard';
import { ProductOwnerGuard } from '../guards/product-owner.guard';
import { CollectionOwnerGuard } from '../guards/collection-owner.guard';
import { BulkProductOwnerGuard } from '../guards/bulk-product-owner.guard';
import { BulkStoreOwnerGuard } from '../guards/bulk-store-owner.guard';
import { BulkCollectionOwnerGuard } from '../guards/bulk-collection-owner.guard';
import { CustomerOwnerGuard } from '../guards/customer-owner.guard';
import { BulkCustomerOwnerGuard } from '../guards/bulk-customer-owner.guard';
import { StoreCustomerGuard } from '../guards/store-customer.guard';
import { OrderOwnerGuard } from '../guards/order-owner.guard';
import { JwtAuthGuard } from '../../authentication/guard/jwt-auth.guard';

export function Auth(...guards: any[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, ...guards));
}

export const AuthStore = () => Auth(StoreOwnerGuard);
export const AuthProduct = () => Auth(ProductOwnerGuard);
export const AuthCollection = () => Auth(CollectionOwnerGuard);
export const AuthBulkProducts = () => Auth(BulkProductOwnerGuard);
export const AuthBulkStores = () => Auth(BulkStoreOwnerGuard);
export const AuthBulkCollections = () => Auth(BulkCollectionOwnerGuard);
export const AuthCustomer = () => Auth(CustomerOwnerGuard);
export const AuthBulkCustomers = () => Auth(BulkCustomerOwnerGuard);
export const AuthStoreCustomers = () => Auth(StoreCustomerGuard);
export const AuthOrder = () => Auth(OrderOwnerGuard);

// Example composite guard for operations requiring both store and customer access
export const AuthStoreAndCustomer = () =>
  Auth(StoreCustomerGuard, CustomerOwnerGuard);
