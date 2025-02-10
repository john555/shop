import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { StoreModule } from '@/lib/admin-api/store/store.module';
import { AuthorizationModule } from '@/common/backend/authorization/authorization.module';
import { SlugModule } from '@/lib/admin-api/slug/slug.module';

@Module({
  imports: [AuthorizationModule, StoreModule, SlugModule],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}