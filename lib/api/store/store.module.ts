import { Module } from '@nestjs/common';
import { StoreResolver } from './store.resolver';
import { StoreService } from './store.service';
import { AuthorizationModule } from '../authorization/authorization.module';
import { AddressOnOwnerModule } from '../address-on-owner/address-on-owner.module';

@Module({
  imports: [AuthorizationModule, AddressOnOwnerModule],
  providers: [StoreResolver, StoreService],
  exports: [StoreService],
})
export class StoreModule {}
