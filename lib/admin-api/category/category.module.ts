import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { CategoryInitializerService } from './category-initializer.service';
import { SlugModule } from '@/admin-api/slug/slug.module';

@Module({
  imports: [SlugModule],
  providers: [CategoryResolver, CategoryService, CategoryInitializerService],
  exports: [CategoryService],
})
export class CategoryModule {}