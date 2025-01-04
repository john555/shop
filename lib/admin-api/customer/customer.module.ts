import { Module } from '@nestjs/common';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';
import { AddressOnOwnerModule } from '../../common/backend/address-on-owner/address-on-owner.module';

@Module({
  imports: [AddressOnOwnerModule],
  providers: [CustomerResolver, CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
