import { Module, forwardRef } from '@nestjs/common';
import { StoreResolver } from './store.resolver';
import { StoreService } from './store.service';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [forwardRef(() => AddressModule)],
  providers: [StoreResolver, StoreService],
  exports: [StoreService],
})
export class StoreModule {}
