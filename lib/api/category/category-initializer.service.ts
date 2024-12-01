import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CategoryFactory } from './categories/category.factory';
import { StoreType } from '@prisma/client';
import { PrismaService } from '@/api/prisma/prisma.service';
import { validateCategoryData } from './category.types';

@Injectable()
export class CategoryInitializerService implements OnModuleInit {
  private readonly logger = new Logger(CategoryInitializerService.name);

  constructor(
    private readonly prisma: PrismaService
  ) {}

  async onModuleInit() {
    await this.initializeCategories();
  }

  private async initializeCategories() {
    try {
      // Initialize categories for each store type
      for (const storeType of Object.values(StoreType)) {
        await this.initializeCategoriesForType(storeType);
      }
      this.logger.log('Category initialization completed successfully');
    } catch (error) {
      this.logger.error('Failed to initialize categories:', error);
    }
  }

  private async initializeCategoriesForType(storeType: StoreType) {
    const creator = CategoryFactory.getCreator(storeType);
    const categories = creator.getCategories();

    // Validate category data
    try {
      validateCategoryData(categories);
    } catch (error) {
      this.logger.error(`Invalid category data for ${storeType}:`, error);
      return;
    }

    // Create categories in transaction to ensure consistency
    await this.prisma.$transaction(async (tx) => {
      await this.createCategoriesRecursive(categories, null, storeType, tx);
    });
  }

  private async createCategoriesRecursive(
    categories: any[],
    parentId: string | null,
    storeType: StoreType,
    tx: any
  ) {
    for (const category of categories) {
      // Check if category already exists
      const existing = await tx.category.findFirst({
        where: {
          slug: category.slug,
          storeType,
        },
      });

      // If it doesn't exist, create it
      if (!existing) {
        const created = await tx.category.create({
          data: {
            name: category.name,
            slug: category.slug,
            description: category.description,
            storeType,
            parentId,
          },
        });

        if (category.children?.length) {
          await this.createCategoriesRecursive(
            category.children,
            created.id,
            storeType,
            tx
          );
        }
      } else {
        // Update existing category
        await tx.category.update({
          where: { id: existing.id },
          data: {
            name: category.name,
            description: category.description,
            parentId,
          },
        });

        if (category.children?.length) {
          await this.createCategoriesRecursive(
            category.children,
            existing.id,
            storeType,
            tx
          );
        }
      }
    }
  }
}
