import { Module } from '@nestjs/common';
import { CollectionResolver } from './collection.resolver';
import { CollectionService } from './collection.service';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [StoreModule],
  providers: [CollectionResolver, CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
