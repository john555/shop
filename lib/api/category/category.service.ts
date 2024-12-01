import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import { Category, StoreType, Product, Prisma, Store } from '@prisma/client';
import { SlugService } from '@/api/slug/slug.service';
import { CategoryCreateInput, CategoryUpdateInput } from './category.dto';
import { PaginationArgs } from '../pagination/pagination.args';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly slugService: SlugService
  ) {}

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findByParentId(parentId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { parentId },
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(
    slug: string,
    storeType: StoreType
  ): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { storeType_slug: { storeType, slug } },
    });
  }

  async findByStoreType(storeType: StoreType): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { storeType },
      orderBy: { name: 'asc' },
    });
  }

  async create(input: CategoryCreateInput): Promise<Category> {
    try {
      // Validate slug uniqueness within store type
      const isUnique = await this.isSlugUnique(input.slug, input.storeType);
      if (!isUnique) {
        throw new BadRequestException(
          'Category slug must be unique within store type'
        );
      }

      // If parentId is provided, verify it exists and belongs to same store type
      if (input.parentId) {
        const parent = await this.findById(input.parentId);
        if (!parent) {
          throw new NotFoundException(
            `Parent category ${input.parentId} not found`
          );
        }
        if (parent.storeType !== input.storeType) {
          throw new BadRequestException(
            'Parent category must be of same store type'
          );
        }
      }

      return this.prisma.category.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          storeType: input.storeType,
          parentId: input.parentId,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create category:', error);
      throw error;
    }
  }

  async update(input: CategoryUpdateInput): Promise<Category> {
    try {
      const category = await this.findById(input.id);
      if (!category) {
        throw new NotFoundException(`Category ${input.id} not found`);
      }

      if (input.slug && input.slug !== category.slug) {
        const isUnique = await this.isSlugUnique(
          input.slug,
          category.storeType,
          input.id
        );
        if (!isUnique) {
          throw new BadRequestException(
            'Category slug must be unique within store type'
          );
        }
      }

      if (input.parentId) {
        const parent = await this.findById(input.parentId);
        if (!parent) {
          throw new NotFoundException(
            `Parent category ${input.parentId} not found`
          );
        }
        if (parent.storeType !== category.storeType) {
          throw new BadRequestException(
            'Parent category must be of same store type'
          );
        }
      }

      return this.prisma.category.update({
        where: { id: input.id },
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          parentId: input.parentId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update category ${input.id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<Category> {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  private async isSlugUnique(
    slug: string,
    storeType: StoreType,
    excludeId?: string
  ): Promise<boolean> {
    const existing = await this.prisma.category.findFirst({
      where: {
        slug,
        storeType,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    return !existing;
  }

  async findCategoryProducts(categoryId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { categoryId },
    });
  }

  async findCategoriesByStore(
    storeType: StoreType, 
    args?: PaginationArgs
  ): Promise<Category[]> {
    try {
      return this.prisma.category.findMany({
        where: { 
          storeType,
          parentId: null // Get root categories
        },
        orderBy: {
          name: 'asc'
        },
        skip: args?.skip,
        take: args?.take
      });
    } catch (error) {
      this.logger.error(`Error fetching categories for store type ${storeType}:`, error);
      throw error;
    }
  }
}
