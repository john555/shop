import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import {
  Product,
  Prisma,
  MediaOwnerType,
  ProductOption,
  ProductVariant,
  Collection,
  Tag,
  Category,
  Media,
  Store,
} from '@prisma/client';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { paginate } from '@/api/pagination/paginate';
import {
  ProductCreateInput,
  ProductUpdateInput,
  ProductFiltersInput,
  ProductOptionInput,
  ProductVariantInput,
  BulkProductUpdateData,
} from './product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Query Methods
  async findById(id: string): Promise<Product | null> {
    try {
      return this.prisma.product.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Product | null> {
    try {
      return this.prisma.product.findUnique({
        where: { slug },
      });
    } catch (error) {
      this.logger.error(`Error fetching product with slug ${slug}:`, error);
      throw error;
    }
  }

  async findByStore(
    storeId: string,
    args?: PaginationArgs,
    filters?: ProductFiltersInput
  ): Promise<Product[]> {
    try {
      const where: Prisma.ProductWhereInput = {
        storeId,
        ...(filters?.status && { status: { in: filters.status } }),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.searchQuery && {
          OR: [
            { title: { contains: filters.searchQuery, mode: 'insensitive' } },
            {
              description: {
                contains: filters.searchQuery,
                mode: 'insensitive',
              },
            },
            { sku: { contains: filters.searchQuery, mode: 'insensitive' } },
          ],
        }),
        ...(filters?.minPrice && {
          price: { gte: new Prisma.Decimal(filters.minPrice) },
        }),
        ...(filters?.maxPrice && {
          price: { lte: new Prisma.Decimal(filters.maxPrice) },
        }),
        ...(filters?.inStock !== undefined && {
          available: filters.inStock ? { gt: 0 } : { equals: 0 },
        }),
      };

      return paginate({
        modelDelegate: this.prisma.product,
        args,
        where,
      });
    } catch (error) {
      this.logger.error(`Error fetching products for store ${storeId}:`, error);
      throw error;
    }
  }

  // Field Resolution Methods
  async findProductStore(productId: string): Promise<Store | null> {
    return this.prisma.store.findFirst({
      where: {
        products: {
          some: { id: productId },
        },
      },
    });
  }

  async findProductCategory(productId: string): Promise<Category | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    if (!product?.categoryId) return null;

    return this.prisma.category.findUnique({
      where: { id: product.categoryId },
    });
  }

  async findProductOptions(productId: string): Promise<ProductOption[]> {
    return this.prisma.productOption.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findProductVariants(productId: string): Promise<ProductVariant[]> {
    return this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findProductCollections(productId: string): Promise<Collection[]> {
    return this.prisma.collection.findMany({
      where: {
        products: {
          some: { id: productId },
        },
      },
    });
  }

  async findProductTags(productId: string): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      where: {
        products: {
          some: { id: productId },
        },
      },
    });
  }

  async findProductMedia(productId: string): Promise<Media[]> {
    return this.prisma.media.findMany({
      where: {
        ownerId: productId,
        ownerType: MediaOwnerType.PRODUCT,
      },
      orderBy: { position: 'asc' },
    });
  }

  // Create/Update/Delete Methods
  async create(input: ProductCreateInput): Promise<Product> {
    try {
      // Validate unique slug
      const slugExists = await this.isSlugUnique(input.slug);
      if (!slugExists) {
        throw new BadRequestException(
          `Product with slug '${input.slug}' already exists`
        );
      }

      // Create the product
      let product = await this.prisma.product.create({
        data: {
          title: input.title,
          description: input.description,
          slug: input.slug,
          status: input.status,
          seoTitle: input.seoTitle,
          seoDescription: input.seoDescription,
          price: new Prisma.Decimal(input.price),
          compareAtPrice: input.compareAtPrice
            ? new Prisma.Decimal(input.compareAtPrice)
            : null,
          sku: input.sku,
          available: input.available,
          trackInventory: input.trackInventory,
          salesChannels: input.salesChannels,
          storeId: input.storeId,
          categoryId: input.categoryId,
        },
      });

      if (input.tagIds?.length) {
        product = await this.prisma.product.update({
          where: { id: product.id },
          data: {
            tags: {
              connect: input.tagIds.map((id) => ({ id })),
            },
          },
        });
      }

      if (input.collectionIds?.length) {
        product = await this.prisma.product.update({
          where: { id: product.id },
          data: {
            collections: {
              connect: input.collectionIds.map((id) => ({ id })),
            },
          },
        });
      }

      return product;
    } catch (error) {
      this.logger.error('Failed to create product:', error);
      throw error;
    }
  }

  async update(input: ProductUpdateInput): Promise<Product> {
    try {
      const product = await this.findById(input.id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${input.id} not found`);
      }

      let updated = await this.prisma.product.update({
        where: { id: input.id },
        data: {
          ...input,
          price: input.price ? new Prisma.Decimal(input.price) : undefined,
          compareAtPrice:
            input.compareAtPrice !== undefined
              ? input.compareAtPrice === null
                ? null
                : new Prisma.Decimal(input.compareAtPrice)
              : undefined,
        },
      });

      if (input.tagIds) {
        updated = await this.prisma.product.update({
          where: { id: input.id },
          data: {
            tags: {
              set: input.tagIds.map((id) => ({ id })),
            },
          },
        });
      }

      if (input.collectionIds) {
        updated = await this.prisma.product.update({
          where: { id: input.id },
          data: {
            collections: {
              set: input.collectionIds.map((id) => ({ id })),
            },
          },
        });
      }

      return updated;
    } catch (error) {
      this.logger.error(`Failed to update product ${input.id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const product = await this.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      await this.prisma.media.deleteMany({
        where: {
          ownerId: id,
          ownerType: MediaOwnerType.PRODUCT,
        },
      });

      return this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkUpdate(
    storeId: string,
    productIds: string[],
    data: BulkProductUpdateData
  ): Promise<number> {
    try {
      const result = await this.prisma.product.updateMany({
        where: {
          id: { in: productIds },
          storeId,
        },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return result.count;
    } catch (error) {
      this.logger.error('Failed to bulk update products:', error);
      throw error;
    }
  }

  async bulkDelete(storeId: string, productIds: string[]): Promise<number> {
    try {
      await this.prisma.media.deleteMany({
        where: {
          ownerId: { in: productIds },
          ownerType: MediaOwnerType.PRODUCT,
        },
      });

      const result = await this.prisma.product.deleteMany({
        where: {
          id: { in: productIds },
          storeId,
        },
      });

      return result.count;
    } catch (error) {
      this.logger.error('Failed to bulk delete products:', error);
      throw error;
    }
  }

  // Options and Variants Management
  async updateProductOptions(
    productId: string,
    options: ProductOptionInput[]
  ): Promise<Product> {
    try {
      const product = await this.findById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      await this.prisma.productOption.deleteMany({ where: { productId } });
      await this.prisma.productOption.createMany({
        data: options.map((option) => ({
          productId,
          name: option.name,
          values: option.values,
        })),
      });

      return this.findById(productId) as Promise<Product>;
    } catch (error) {
      this.logger.error(
        `Failed to update options for product ${productId}:`,
        error
      );
      throw error;
    }
  }

  async updateProductVariants(
    productId: string,
    variants: ProductVariantInput[]
  ): Promise<Product> {
    try {
      const product = await this.findById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      await this.prisma.productVariant.deleteMany({ where: { productId } });
      for (const variant of variants) {
        await this.prisma.productVariant.create({
          data: {
            productId,
            optionCombination: variant.optionCombination,
            price: new Prisma.Decimal(variant.price),
            compareAtPrice: variant.compareAtPrice
              ? new Prisma.Decimal(variant.compareAtPrice)
              : null,
            sku: variant.sku,
            available: variant.available ?? 0,
          },
        });
      }

      return this.findById(productId) as Promise<Product>;
    } catch (error) {
      this.logger.error(
        `Failed to update variants for product ${productId}:`,
        error
      );
      throw error;
    }
  }

  // Validation Methods
  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const product = await this.prisma.product.findFirst({
        where: {
          slug,
          id: excludeId ? { not: excludeId } : undefined,
        },
      });
      return !product;
    } catch (error) {
      this.logger.error(`Error validating slug uniqueness for ${slug}:`, error);
      throw error;
    }
  }
}
