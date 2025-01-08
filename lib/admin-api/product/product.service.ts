import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/lib/common/prisma/prisma.service';
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
import { PaginationArgs } from '@/lib/common/backend/pagination/pagination.args';
import { paginate } from '@/lib/common/backend/pagination/paginate';
import { SlugService } from '@/lib/common/backend/slug/slug.service';
import {
  ProductCreateInput,
  ProductUpdateInput,
  ProductFiltersInput,
  BulkProductUpdateData,
  ProductOptionInput,
} from './product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly slugService: SlugService
  ) {}

  // Helper Methods for Variants
  private generateVariantCombinations(
    options: ProductOptionInput[]
  ): string[][] {
    const optionValues = options.map((option) => option.values);
    const combinations: string[][] = [];

    const generateCombos = (current: string[], index: number) => {
      if (index === optionValues.length) {
        combinations.push([...current]);
        return;
      }

      for (const value of optionValues[index]) {
        current.push(value);
        generateCombos(current, index + 1);
        current.pop();
      }
    };

    generateCombos([], 0);
    return combinations;
  }

  // Query Methods
  async findById(id: string): Promise<Product | null> {
    try {
      return this.prisma.product.findUnique({
        where: { id },
        include: {
          variants: {
            where: {
              optionCombination: { equals: ['Default'] },
            },
          },
        },
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
        include: {
          variants: {
            where: {
              optionCombination: { equals: ['Default'] },
            },
          },
        },
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
          ],
        }),
        ...(filters?.minPrice && {
          variants: {
            some: { price: { gte: new Prisma.Decimal(filters.minPrice) } },
          },
        }),
        ...(filters?.maxPrice && {
          variants: {
            some: { price: { lte: new Prisma.Decimal(filters.maxPrice) } },
          },
        }),
        ...(filters?.inStock !== undefined && {
          variants: {
            some: { available: filters.inStock ? { gt: 0 } : { equals: 0 } },
          },
        }),
      };

      return paginate({
        modelDelegate: this.prisma.product,
        args,
        where,
        include: {
          variants: {
            where: {
              optionCombination: { equals: ['Default'] },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error fetching products for store ${storeId}:`, error);
      throw error;
    }
  }

  // Create Operation
  async create(input: ProductCreateInput): Promise<Product> {
    try {
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
        const productData: Prisma.ProductCreateInput = {
          title: input.title,
          description: input.description ?? null,
          slug,
          status: input.status || ProductStatus.DRAFT,
          seoTitle: input.seoTitle ?? null,
          seoDescription: input.seoDescription ?? null,
          trackInventory: input.trackInventory ?? false,
          salesChannels: input.salesChannels || [SalesChannel.ONLINE],
          store: {
            connect: { id: input.storeId },
          },
          category: input.categoryId
            ? {
                connect: { id: input.categoryId },
              }
            : undefined,
          tags: input.tagIds?.length
            ? {
                connect: input.tagIds.map((id) => ({ id })),
              }
            : undefined,
          collections: input.collectionIds?.length
            ? {
                connect: input.collectionIds.map((id) => ({ id })),
              }
            : undefined,
        };

        const newProduct = await tx.product.create({
          data: productData,
        });

        // Handle media associations if provided
        if (input.mediaIds?.length) {
          // Get last position
          const lastPosition = await tx.mediaOwnership.findFirst({
            where: {
              ownerType: MediaOwnerType.PRODUCT,
              ownerId: newProduct.id,
            },
            orderBy: {
              position: 'desc',
            },
          });

          let startPosition = (lastPosition?.position ?? -1) + 1;

          // Create media ownership records
          await tx.mediaOwnership.createMany({
            data: input.mediaIds.map((mediaId, index) => ({
              mediaId,
              ownerId: newProduct.id,
              ownerType: MediaOwnerType.PRODUCT,
              position: startPosition + index,
            })),
          });
        }

        if (input.options?.length) {
          const optionNames = new Set(input.options.map((o) => o.name));
          if (optionNames.size !== input.options.length) {
            throw new BadRequestException('Option names must be unique');
          }

          await tx.productOption.createMany({
            data: input.options.map((option) => ({
              productId: newProduct.id,
              name: option.name,
              values: option.values,
            })),
          });

          if (!input.variants?.length) {
            const combinations = this.generateVariantCombinations(
              input.options
            );
            await tx.productVariant.createMany({
              data: combinations.map((combination) => ({
                productId: newProduct.id,
                optionCombination: { set: combination },
                price: new Prisma.Decimal(0),
                compareAtPrice: null,
                sku: null,
                available: 0,
              })),
            });
          } else {
            const expectedCombinations = this.generateVariantCombinations(
              input.options
            );
            const providedCombinations = input.variants.map((v) =>
              v.optionCombination.join('-')
            );

            const missingCombinations = expectedCombinations.filter(
              (combo) => !providedCombinations.includes(combo.join('-'))
            );

            if (missingCombinations.length > 0) {
              throw new BadRequestException(
                `Missing variants for combinations: ${missingCombinations
                  .map((c) => c.join('-'))
                  .join(', ')}`
              );
            }

            await tx.productVariant.createMany({
              data: input.variants.map((variant) => ({
                productId: newProduct.id,
                optionCombination: { set: variant.optionCombination },
                price: new Prisma.Decimal(variant.price),
                compareAtPrice: variant.compareAtPrice
                  ? new Prisma.Decimal(variant.compareAtPrice)
                  : null,
                sku: variant.sku ?? null,
                available: variant.available ?? 0,
              })),
            });
          }
        } else {
          await tx.productVariant.create({
            data: {
              product: { connect: { id: newProduct.id } },
              optionCombination: { set: ['Default'] },
              price: new Prisma.Decimal(input.price ?? 0),
              compareAtPrice: input.compareAtPrice
                ? new Prisma.Decimal(input.compareAtPrice)
                : null,
              sku: input.sku ?? null,
              available: input.available ?? 0,
            },
          });
        }

        const result = await tx.product.findUnique({
          where: { id: newProduct.id },
          include: { variants: true },
        });

        if (!result) {
          throw new Error('Failed to create product');
        }

        return result;
      });

      if (!product) {
        throw new Error('Failed to create product');
      }

      return product;
    } catch (error) {
      this.logger.error('Failed to create product:', error);
      throw error;
    }
  }

  // Update Operation
  async update(input: ProductUpdateInput): Promise<Product> {
    try {
      const existingProduct = await this.findById(input.id);
      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${input.id} not found`);
      }

      let slug = input.slug;
      if (slug && slug !== existingProduct.slug) {
        if (!this.slugService.isValidSlug(slug)) {
          throw new BadRequestException(
            'Invalid slug format. Use only lowercase letters, numbers, and hyphens.'
          );
        }
        if (
          !(await this.isSlugUnique(slug, existingProduct.storeId, input.id))
        ) {
          slug = await this.slugService.createUniqueSlug(slug, (s) =>
            this.isSlugUnique(s, existingProduct.storeId, input.id)
          );
        }
      }

      const product = await this.prisma.$transaction(async (tx) => {
        // Update base product
        const updatedProduct = await tx.product.update({
          where: { id: input.id },
          data: {
            title: input.title,
            description: input.description,
            slug,
            status: input.status,
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
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
          },
        });

        // Handle media updates if provided
        if (input.mediaIds !== undefined) {
          // Remove existing media ownerships
          await tx.mediaOwnership.deleteMany({
            where: {
              ownerId: input.id,
              ownerType: MediaOwnerType.PRODUCT,
            },
          });

          if (input.mediaIds.length > 0) {
            // Verify all media exists and belongs to the same store
            const media = await tx.media.findMany({
              where: {
                id: { in: input.mediaIds },
                storeId: existingProduct.storeId,
              },
            });

            if (media.length !== input.mediaIds.length) {
              throw new BadRequestException('Invalid media IDs provided');
            }

            // Add new media ownerships
            await tx.mediaOwnership.createMany({
              data: input.mediaIds.map((mediaId, index) => ({
                mediaId,
                ownerId: input.id,
                ownerType: MediaOwnerType.PRODUCT,
                position: index,
              })),
            });
          }
        }

        // Handle variant updates
        await this.handleVariantUpdates(tx, input.id, input);

        const result = await tx.product.findUnique({
          where: { id: updatedProduct.id },
          include: { variants: true },
        });

        if (!result) {
          throw new Error('Failed to update product');
        }

        return result;
      });

      if (!product) {
        throw new Error('Failed to update product');
      }

      return product;
    } catch (error) {
      this.logger.error(`Failed to update product ${input.id}:`, error);
      throw error;
    }
  }

  private async handleVariantUpdates(
    tx: Prisma.TransactionClient,
    productId: string,
    input: ProductUpdateInput
  ): Promise<void> {
    if (
      input.options === undefined &&
      input.variants === undefined &&
      input.price === undefined &&
      input.compareAtPrice === undefined &&
      input.sku === undefined &&
      input.available === undefined
    ) {
      return;
    }

    const existingOptions = await tx.productOption.findMany({
      where: { productId },
      orderBy: { name: 'asc' },
    });

    if (
      (input.price !== undefined ||
        input.compareAtPrice !== undefined ||
        input.sku !== undefined ||
        input.available !== undefined) &&
      !existingOptions.length
    ) {
      const defaultVariant = await tx.productVariant.findFirst({
        where: {
          productId,
          optionCombination: { equals: ['Default'] },
          isArchived: false,
        },
      });

      if (defaultVariant) {
        await tx.productVariant.update({
          where: { id: defaultVariant.id },
          data: {
            price:
              input.price !== undefined
                ? new Prisma.Decimal(input.price)
                : undefined,
            compareAtPrice:
              input.compareAtPrice !== undefined
                ? input.compareAtPrice === null
                  ? null
                  : new Prisma.Decimal(input.compareAtPrice)
                : undefined,
            sku: input.sku !== undefined ? input.sku : undefined,
            available:
              input.available !== undefined ? input.available : undefined,
          },
        });
      } else {
        await tx.productVariant.create({
          data: {
            productId,
            optionCombination: { set: ['Default'] },
            price: new Prisma.Decimal(input.price ?? 0),
            compareAtPrice:
              input.compareAtPrice !== undefined
                ? input.compareAtPrice === null
                  ? null
                  : new Prisma.Decimal(input.compareAtPrice)
                : null,
            sku: input.sku ?? null,
            available: input.available ?? 0,
          },
        });
      }
      return;
    }

    if (input.variants?.length && input.options === undefined) {
      const existingVariants = await tx.productVariant.findMany({
        where: {
          productId,
          isArchived: false,
        },
      });

      for (const variantInput of input.variants) {
        if (variantInput.id) {
          await tx.productVariant.update({
            where: { id: variantInput.id },
            data: {
              price: new Prisma.Decimal(variantInput.price),
              compareAtPrice: variantInput.compareAtPrice
                ? new Prisma.Decimal(variantInput.compareAtPrice)
                : null,
              sku: variantInput.sku ?? null,
              available: variantInput.available ?? 0,
            },
          });
          continue;
        }

        const existingVariant = existingVariants.find(
          (v) =>
            JSON.stringify(v.optionCombination) ===
            JSON.stringify(variantInput.optionCombination)
        );

        if (existingVariant) {
          await tx.productVariant.update({
            where: { id: existingVariant.id },
            data: {
              price: new Prisma.Decimal(variantInput.price),
              compareAtPrice: variantInput.compareAtPrice
                ? new Prisma.Decimal(variantInput.compareAtPrice)
                : null,
              sku: variantInput.sku ?? null,
              available: variantInput.available ?? 0,
            },
          });
        } else {
          throw new BadRequestException(
            `Variant with combination ${variantInput.optionCombination.join(
              ', '
            )} not found`
          );
        }
      }
      return;
    }

    if (input.options !== undefined) {
      await tx.productVariant.updateMany({
        where: {
          productId,
          isArchived: false,
        },
        data: {
          isArchived: true,
          archivedAt: new Date(),
        },
      });

      await tx.productOption.deleteMany({ where: { productId } });

      if (input.options.length === 0) {
        await tx.productVariant.create({
          data: {
            productId,
            optionCombination: { set: ['Default'] },
            price: new Prisma.Decimal(input.price ?? 0),
            compareAtPrice: input.compareAtPrice
              ? new Prisma.Decimal(input.compareAtPrice)
              : null,
            sku: input.sku ?? null,
            available: input.available ?? 0,
          },
        });
        return;
      }

      await tx.productOption.createMany({
        data: input.options.map((option) => ({
          productId,
          name: option.name,
          values: option.values,
        })),
      });

      const combinations = this.generateVariantCombinations(input.options);

      if (input.variants?.length) {
        const providedCombinations = input.variants.map((v) =>
          v.optionCombination.join('-')
        );

        const missingCombinations = combinations.filter(
          (combo) => !providedCombinations.includes(combo.join('-'))
        );

        if (missingCombinations.length > 0) {
          throw new BadRequestException(
            `Missing variants for combinations: ${missingCombinations
              .map((c) => c.join('-'))
              .join(', ')}`
          );
        }

        const archivedVariants = await tx.productVariant.findMany({
          where: {
            productId,
            isArchived: true,
          },
        });

        for (const variantInput of input.variants) {
          const matchingArchived = archivedVariants.find(
            (v) =>
              JSON.stringify(v.optionCombination) ===
              JSON.stringify(variantInput.optionCombination)
          );

          if (matchingArchived) {
            await tx.productVariant.update({
              where: { id: matchingArchived.id },
              data: {
                isArchived: false,
                archivedAt: null,
                price: new Prisma.Decimal(variantInput.price),
                compareAtPrice: variantInput.compareAtPrice
                  ? new Prisma.Decimal(variantInput.compareAtPrice)
                  : null,
                sku: variantInput.sku ?? matchingArchived.sku,
                available: variantInput.available ?? matchingArchived.available,
              },
            });
          } else {
            await tx.productVariant.create({
              data: {
                productId,
                optionCombination: { set: variantInput.optionCombination },
                price: new Prisma.Decimal(variantInput.price),
                compareAtPrice: variantInput.compareAtPrice
                  ? new Prisma.Decimal(variantInput.compareAtPrice)
                  : null,
                sku: variantInput.sku ?? null,
                available: variantInput.available ?? 0,
              },
            });
          }
        }
      } else {
        await tx.productVariant.createMany({
          data: combinations.map((combination) => ({
            productId,
            optionCombination: { set: combination },
            price: new Prisma.Decimal(0),
            compareAtPrice: null,
            sku: null,
            available: 0,
          })),
        });
      }
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
        // Delete related media by first finding them through MediaOwnership
        const mediaToDelete = await tx.mediaOwnership.findMany({
          where: {
            ownerId: id,
            ownerType: MediaOwnerType.PRODUCT,
          },
          select: {
            mediaId: true,
          },
        });

        if (mediaToDelete.length > 0) {
          await tx.media.deleteMany({
            where: {
              id: {
                in: mediaToDelete.map((m) => m.mediaId),
              },
            },
          });
        }

        // Delete the product (cascade will handle options and variants)
        return tx.product.delete({
          where: { id },
          include: {
            variants: {
              where: {
                optionCombination: { equals: ['Default'] },
              },
            },
          },
        });
      });
    } catch (error) {
      this.logger.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  }

  async bulkDelete(storeId: string, productIds: string[]): Promise<number> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Find and delete related media
        const mediaToDelete = await tx.mediaOwnership.findMany({
          where: {
            ownerId: { in: productIds },
            ownerType: MediaOwnerType.PRODUCT,
          },
          select: {
            mediaId: true,
          },
        });

        if (mediaToDelete.length > 0) {
          await tx.media.deleteMany({
            where: {
              id: {
                in: mediaToDelete.map((m) => m.mediaId),
              },
            },
          });
        }

        // Delete products (cascade will handle options and variants)
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

  // Bulk Operations
  async bulkUpdate(
    storeId: string,
    productIds: string[],
    data: BulkProductUpdateData
  ): Promise<number> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Update product base fields
        await tx.product.updateMany({
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

        // Handle category relationship separately if needed
        if (data.categoryId !== undefined) {
          await Promise.all(
            productIds.map((id) =>
              tx.product.update({
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
        }

        return productIds.length;
      });
    } catch (error) {
      this.logger.error('Failed to bulk update products:', error);
      throw error;
    }
  }

  // Field Resolution Methods
  async findProductStore(productId: string): Promise<Store> {
    return this.prisma.store.findFirstOrThrow({
      where: {
        products: {
          some: { id: productId },
        },
      },
    });
  }

  async findProductCategory(categoryId: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id: categoryId },
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
      where: {
        productId,
        isArchived: false,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findArchivedProductVariants(
    productId: string
  ): Promise<ProductVariant[]> {
    return this.prisma.productVariant.findMany({
      where: {
        productId,
        isArchived: true,
      },
      orderBy: { archivedAt: 'desc' },
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
    const mediaWithOwnerships = await this.prisma.media.findMany({
      where: {
        owners: {
          some: {
            ownerId: productId,
            ownerType: MediaOwnerType.PRODUCT,
          },
        },
      },
      include: {
        owners: {
          where: {
            ownerId: productId,
            ownerType: MediaOwnerType.PRODUCT,
          },
        },
      },
    });

    // Sort by position from the ownership relation
    return mediaWithOwnerships.sort((a, b) => {
      const positionA = a.owners[0]?.position ?? 0;
      const positionB = b.owners[0]?.position ?? 0;
      return positionA - positionB;
    });
  }

  // Validation Methods
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

  // Resolver Methods for computed fields
  async getPrice(productId: string): Promise<number> {
    const defaultVariant = await this.prisma.productVariant.findFirst({
      where: {
        productId,
        optionCombination: { equals: ['Default'] },
      },
    });
    return defaultVariant?.price.toNumber() ?? 0;
  }

  async getCompareAtPrice(productId: string): Promise<number | null> {
    const defaultVariant = await this.prisma.productVariant.findFirst({
      where: {
        productId,
        optionCombination: { equals: ['Default'] },
      },
    });
    return defaultVariant?.compareAtPrice?.toNumber() ?? null;
  }

  async getSku(productId: string): Promise<string | null> {
    const defaultVariant = await this.prisma.productVariant.findFirst({
      where: {
        productId,
        optionCombination: { equals: ['Default'] },
      },
    });
    return defaultVariant?.sku ?? null;
  }

  async getAvailable(productId: string): Promise<number> {
    const defaultVariant = await this.prisma.productVariant.findFirst({
      where: {
        productId,
        optionCombination: { equals: ['Default'] },
      },
    });
    return defaultVariant?.available ?? 0;
  }
}
