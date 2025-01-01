import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { StoreModule } from '../store/store.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { SlugModule } from '@/admin-api/slug/slug.module';

@Module({
  imports: [AuthorizationModule, StoreModule, SlugModule],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}