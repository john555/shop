import { Module, forwardRef } from '@nestjs/common';
import { StoreResolver } from './store.resolver';
import { StoreService } from './store.service';
import { AddressModule } from '../address/address.module';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [AuthorizationModule, forwardRef(() => AddressModule)],
  providers: [StoreResolver, StoreService],
  exports: [StoreService],
})
export class StoreModule {}
