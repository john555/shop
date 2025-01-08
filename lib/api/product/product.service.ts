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
import { ProductFiltersInput } from './product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Query Methods
  async findByIdOrSlug(idOrSlug: string): Promise<Product | null> {
    try {
      return this.prisma.product.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
        include: {
          variants: {
            where: {
              optionCombination: { equals: ['Default'] },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error fetching product with ID ${idOrSlug}:`, error);
      throw error;
    }
  }

  async findByStoreIdOrSlug(
    storeIdOrSlug: string,
    args?: PaginationArgs,
    filters?: ProductFiltersInput
  ): Promise<Product[]> {
    try {
      const store = await this.prisma.store.findFirst({
        where: { OR: [{ id: storeIdOrSlug }, { slug: storeIdOrSlug }] },
      });

      if (!store?.id) {
        throw new NotFoundException(`Store with ID ${storeIdOrSlug} not found`);
      }
      const where: Prisma.ProductWhereInput = {
        storeId: store?.id,
        status: ProductStatus.ACTIVE,
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
      this.logger.error(
        `Error fetching products for store ${storeIdOrSlug}:`,
        error
      );
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
