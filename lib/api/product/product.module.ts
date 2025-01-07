import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { StoreModule } from '@/common/backend/store/store.module';
import { AuthorizationModule } from '@/common/backend/authorization/authorization.module';
import { SlugModule } from '@/common/backend/slug/slug.module';

@Module({
  imports: [AuthorizationModule, StoreModule, SlugModule],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}