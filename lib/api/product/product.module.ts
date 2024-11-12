import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [StoreModule],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
