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
  ProductStatus,
  SalesChannel,
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
import { SlugService } from '@/api/slug/slug.service';
import {
  ProductCreateInput,
  ProductUpdateInput,
  ProductFiltersInput,
  BulkProductUpdateData,
} from './product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly slugService: SlugService
  ) {}

  // Core CRUD Operations
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

  async findBySlug(slug: string, storeId: string): Promise<Product | null> {
    try {
      return this.prisma.product.findUnique({
        where: { storeId_slug: { storeId, slug } },
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

  // Create Operation
  async create(input: ProductCreateInput): Promise<Product> {
    try {
      // Generate or validate slug
      let slug = input.slug;
      if (!slug) {
        slug = await this.slugService.createUniqueSlug(input.title, (s) =>
          this.isSlugUnique(s, input.storeId)
        );
      } else if (!this.slugService.isValidSlug(slug)) {
        throw new BadRequestException(
          'Invalid slug format. Use only lowercase letters, numbers, and hyphens.'
        );
      } else if (!(await this.isSlugUnique(slug, input.storeId))) {
        slug = await this.slugService.createUniqueSlug(slug, (s) =>
          this.isSlugUnique(s, input.storeId)
        );
      }

      const product = await this.prisma.$transaction(async (tx) => {
        // Create the base product
        const newProduct = await tx.product.create({
          data: {
            title: input.title,
            description: input.description,
            slug,
            status: input.status || ProductStatus.DRAFT,
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
            price: new Prisma.Decimal(input.price),
            compareAtPrice: input.compareAtPrice
              ? new Prisma.Decimal(input.compareAtPrice)
              : null,
            sku: input.sku,
            available: input.available ?? 0,
            trackInventory: input.trackInventory ?? false,
            salesChannels: input.salesChannels || [SalesChannel.ONLINE],
            storeId: input.storeId,
            categoryId: input.categoryId,
            tags: input.tagIds?.length
              ? { connect: input.tagIds.map((id) => ({ id })) }
              : undefined,
            collections: input.collectionIds?.length
              ? { connect: input.collectionIds.map((id) => ({ id })) }
              : undefined,
          },
        });

        // Add options if provided
        if (input.options?.length) {
          await tx.productOption.createMany({
            data: input.options.map((option) => ({
              productId: newProduct.id,
              name: option.name,
              values: option.values,
            })),
          });
        }

        // Add variants if provided
        if (input.variants?.length) {
          await tx.productVariant.createMany({
            data: input.variants.map((variant) => ({
              productId: newProduct.id,
              optionCombination: variant.optionCombination,
              price: new Prisma.Decimal(variant.price),
              compareAtPrice: variant.compareAtPrice
                ? new Prisma.Decimal(variant.compareAtPrice)
                : null,
              sku: variant.sku,
              available: variant.available ?? 0,
            })),
          });
        }

        return newProduct;
      });

      return product;
    } catch (error) {
      this.logger.error('Failed to create product:', error);
      throw error;
    }
  }

  // Update Operation
  async update(input: ProductUpdateInput): Promise<Product> {
    try {
      const product = await this.findById(input.id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${input.id} not found`);
      }

      // Handle slug update if provided
      let slug = input.slug;
      if (slug && slug !== product.slug) {
        if (!this.slugService.isValidSlug(slug)) {
          throw new BadRequestException(
            'Invalid slug format. Use only lowercase letters, numbers, and hyphens.'
          );
        }
        if (!(await this.isSlugUnique(slug, product.storeId, input.id))) {
          slug = await this.slugService.createUniqueSlug(slug, (s) =>
            this.isSlugUnique(s, product.storeId, input.id)
          );
        }
      }

      const updateData: Prisma.ProductUpdateInput = {
        title: input.title,
        description: input.description,
        slug,
        status: input.status,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        price: input.price ? new Prisma.Decimal(input.price) : undefined,
        compareAtPrice:
          input.compareAtPrice !== undefined
            ? input.compareAtPrice === null
              ? null
              : new Prisma.Decimal(input.compareAtPrice)
            : undefined,
        sku: input.sku,
        available: input.available,
        trackInventory: input.trackInventory,
        salesChannels: input.salesChannels,
        category:
          input.categoryId !== undefined
            ? input.categoryId === null
              ? { disconnect: true }
              : { connect: { id: input.categoryId } }
            : undefined,
        tags: input.tagIds
          ? { set: input.tagIds.map((id) => ({ id })) }
          : undefined,
        collections: input.collectionIds
          ? { set: input.collectionIds.map((id) => ({ id })) }
          : undefined,
      };

      return this.prisma.$transaction(async (tx) => {
        const updatedProduct = await tx.product.update({
          where: { id: input.id },
          data: updateData,
        });

        // Update options if provided
        if (input.options !== undefined) {
          await tx.productOption.deleteMany({
            where: { productId: input.id },
          });
          if (input.options.length > 0) {
            await tx.productOption.createMany({
              data: input.options.map((option) => ({
                productId: input.id,
                name: option.name,
                values: option.values,
              })),
            });
          }
        }

        // Update variants if provided
        if (input.variants !== undefined) {
          await tx.productVariant.deleteMany({
            where: { productId: input.id },
          });
          if (input.variants.length > 0) {
            await tx.productVariant.createMany({
              data: input.variants.map((variant) => ({
                productId: input.id,
                optionCombination: variant.optionCombination,
                price: new Prisma.Decimal(variant.price),
                compareAtPrice: variant.compareAtPrice
                  ? new Prisma.Decimal(variant.compareAtPrice)
                  : null,
                sku: variant.sku,
                available: variant.available ?? 0,
              })),
            });
          }
        }

        return updatedProduct;
      });
    } catch (error) {
      this.logger.error(`Failed to update product ${input.id}:`, error);
      throw error;
    }
  }

  // Delete Operation
  async delete(id: string): Promise<Product> {
    try {
      const product = await this.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return await this.prisma.$transaction(async (tx) => {
        // Delete related media
        await tx.media.deleteMany({
          where: {
            ownerId: id,
            ownerType: MediaOwnerType.PRODUCT,
          },
        });

        // Delete the product
        return tx.product.delete({
          where: { id },
        });
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
      // For relationship updates, we need to use regular update
      if (data.categoryId !== undefined) {
        await this.prisma.product.updateMany({
          where: {
            id: { in: productIds },
            storeId,
          },
          data: {
            status: data.status,
            salesChannels: data.salesChannels,
            trackInventory: data.trackInventory,
            updatedAt: new Date(),
          },
        });

        // Handle category relationship separately for each product
        await Promise.all(
          productIds.map((id) =>
            this.prisma.product.update({
              where: { id },
              data: {
                category:
                  data.categoryId === null
                    ? { disconnect: true }
                    : { connect: { id: data.categoryId } },
              },
            })
          )
        );

        return productIds.length;
      }

      // If no relationship updates, use updateMany
      const result = await this.prisma.product.updateMany({
        where: {
          id: { in: productIds },
          storeId,
        },
        data: {
          status: data.status,
          salesChannels: data.salesChannels,
          trackInventory: data.trackInventory,
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
      return await this.prisma.$transaction(async (tx) => {
        // Delete related media
        await tx.media.deleteMany({
          where: {
            ownerId: { in: productIds },
            ownerType: MediaOwnerType.PRODUCT,
          },
        });

        // Delete products
        const result = await tx.product.deleteMany({
          where: {
            id: { in: productIds },
            storeId,
          },
        });

        return result.count;
      });
    } catch (error) {
      this.logger.error('Failed to bulk delete products:', error);
      throw error;
    }
  }

  // Helper Methods
  private async isSlugUnique(
    slug: string,
    storeId: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const product = await this.prisma.product.findFirst({
        where: {
          slug,
          storeId,
          id: excludeId ? { not: excludeId } : undefined,
        },
      });
      return !product;
    } catch (error) {
      this.logger.error(`Error checking slug uniqueness for ${slug}:`, error);
      throw error;
    }
  }
}
