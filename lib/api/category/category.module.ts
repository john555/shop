import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { StoreModule } from '../store/store.module';
import { PrismaModule } from '@/api/prisma/prisma.module';

@Module({
  imports: [StoreModule, PrismaModule],
  providers: [CategoryResolver, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
