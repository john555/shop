import { Module } from '@nestjs/common';
import { StoreResolver } from './store.resolver';
import { StoreService } from './store.service';

@Module({
  imports: [],
  providers: [StoreResolver, StoreService],
  exports: [StoreService],
})
export class StoreModule {}
