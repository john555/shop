import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Category, Prisma, PrismaClient, StoreType } from '@prisma/client';
import { PrismaService } from '@/api/prisma/prisma.service';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { paginate } from '@/api/pagination/paginate';
import {
  CategoryCreateData,
  CategoryUpdateData,
  CategoryInclude,
  DEFAULT_CATEGORY_INCLUDE,
  PresetCategory,
} from './category.types';
import { CategoryFactory } from './categories/category.factory';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getCategoryById(
    id: string,
    include: CategoryInclude = DEFAULT_CATEGORY_INCLUDE
  ): Promise<Category | null> {
    try {
      return this.prismaService.category.findUnique({
        where: { id },
        include,
      });
    } catch (error) {
      this.logger.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }

  async getCategoryBySlug(
    slug: string,
    storeId: string,
    include: CategoryInclude = DEFAULT_CATEGORY_INCLUDE
  ): Promise<Category | null> {
    try {
      return this.prismaService.category.findFirst({
        where: { slug, storeId },
        include,
      });
    } catch (error) {
      this.logger.error(`Error fetching category with slug ${slug}:`, error);
      throw error;
    }
  }

  async createStoreCategoriesFromTransaction(
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    storeId: string,
    storeType: StoreType
  ): Promise<void> {
    const creator = CategoryFactory.getCreator(storeType);
    const categories = creator.getCategories();

    const createCategoryAndChildren = async (
      category: PresetCategory,
      parentId?: string
    ): Promise<void> => {
      const created = await tx.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          store: { connect: { id: storeId } },
          ...(parentId && { parent: { connect: { id: parentId } } }),
        },
      });

      if (category.children) {
        for (const child of category.children) {
          await createCategoryAndChildren(child, created.id);
        }
      }
    };

    for (const category of categories) {
      await createCategoryAndChildren(category);
    }
  }

  async getCategoriesByStoreId(
    storeId: string,
    args?: PaginationArgs,
    include: CategoryInclude = DEFAULT_CATEGORY_INCLUDE
  ): Promise<Category[]> {
    try {
      const categories = await paginate({
        modelDelegate: this.prismaService.category,
        args,
        where: { storeId },
        include,
      });

      return categories;
    } catch (error) {
      this.logger.error(
        `Error fetching categories for store ${storeId}:`,
        error
      );
      throw error;
    }
  }

  async create(
    input: CategoryCreateData,
    include: CategoryInclude = DEFAULT_CATEGORY_INCLUDE
  ): Promise<Category> {
    try {
      return this.prismaService.category.create({
        data: input,
        include,
      });
    } catch (error) {
      this.logger.error('Error creating category:', error);
      throw error;
    }
  }

  async update(
    id: string,
    input: CategoryUpdateData,
    include: CategoryInclude = DEFAULT_CATEGORY_INCLUDE
  ): Promise<Category> {
    try {
      const category = await this.getCategoryById(id);
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return this.prismaService.category.update({
        where: { id },
        data: input,
        include,
      });
    } catch (error) {
      this.logger.error(`Error updating category ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<Category> {
    try {
      const category = await this.getCategoryById(id);
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return this.prismaService.category.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }

  async isSlugUnique(
    slug: string,
    storeId: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const existingCategory = await this.prismaService.category.findFirst({
        where: {
          slug,
          storeId,
          id: excludeId ? { not: excludeId } : undefined,
        },
      });
      return !existingCategory;
    } catch (error) {
      this.logger.error(`Error validating slug uniqueness for ${slug}:`, error);
      throw error;
    }
  }
}
