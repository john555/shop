import { Module } from '@nestjs/common';
import { StoreResolver } from './store.resolver';
import { StoreService } from './store.service';
import { AuthorizationModule } from '@/common/backend/authorization/authorization.module';
import { AddressOnOwnerModule } from '../address-on-owner/address-on-owner.module';
import { CategoryModule } from '@/common/backend/category/category.module';

@Module({
  imports: [AuthorizationModule, AddressOnOwnerModule, CategoryModule],
  providers: [StoreResolver, StoreService],
  exports: [StoreService],
})
export class StoreModule {}
