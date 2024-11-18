import { Module } from '@nestjs/common';
import { AddressOnOwnerResolver } from './address-on-owner.resolver';
import { AddressOnOwnerService } from './address-on-owner.service';

@Module({
  providers: [AddressOnOwnerResolver, AddressOnOwnerService],
  exports: [AddressOnOwnerService],
})
export class AddressOnOwnerModule {}
