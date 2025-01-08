import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/lib/common/prisma/prisma.service';
import { Collection, Product, Prisma, Store } from '@prisma/client';
import { PaginationArgs } from '@/lib/common/backend/pagination/pagination.args';
import { paginate } from '@/lib/common/backend/pagination/paginate';
import { CollectionBulkUpdateData } from './collection.dto';
import { SlugService } from '@/lib/common/backend/slug/slug.service';

type CollectionWithRelations = Collection & {
  store?: Store;
  products?: Product[];
};

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly slugService: SlugService
  ) {}

  async getCollectionById(id: string): Promise<CollectionWithRelations | null> {
    try {
      const collection = await this.prismaService.collection.findUnique({
        where: { id },
        include: { products: true },
      });

      if (!collection) {
        return null;
      }

      return collection;
    } catch (error) {
      this.logger.error(`Error fetching collection ${id}:`, error);
      throw error;
    }
  }

  async getCollectionsByStoreId(
    storeId: string,
    args?: PaginationArgs
  ): Promise<CollectionWithRelations[]> {
    try {
      const collections = await paginate({
        modelDelegate: this.prismaService.collection,
        args,
        where: { storeId },
        include: { products: true },
      });

      return collections;
    } catch (error) {
      this.logger.error(
        `Error fetching collections for store ${storeId}:`,
        error
      );
      throw error;
    }
  }

  async create(
    data: Prisma.CollectionUncheckedCreateInput & { productIds?: string[] }
  ): Promise<CollectionWithRelations> {
    try {
      // Generate or validate slug
      let slug = data.slug;
      if (!slug) {
        slug = await this.slugService.createUniqueSlug(data.name, (s) =>
          this.isSlugUnique(s, data.storeId)
        );
      } else if (!this.slugService.isValidSlug(slug)) {
        throw new BadRequestException(
          'Invalid slug format. Use only lowercase letters, numbers, and hyphens.'
        );
      } else if (!(await this.isSlugUnique(slug, data.storeId))) {
        slug = await this.slugService.createUniqueSlug(slug, (s) =>
          this.isSlugUnique(s, data.storeId)
        );
      }

      const { productIds, ...collectionData } = data;
      const collection = await this.prismaService.collection.create({
        data: {
          ...collectionData,
          slug,
          products: productIds
            ? { connect: productIds.map((id) => ({ id })) }
            : undefined,
        },
        include: { products: true },
      });

      return collection;
    } catch (error) {
      this.logger.error('Error creating collection:', error);
      throw error;
    }
  }

  async update(
    id: string,
    data: Prisma.CollectionUncheckedUpdateInput & { productIds?: string[] }
  ): Promise<CollectionWithRelations> {
    try {
      const { productIds, ...collectionData } = data;
      const collection = await this.getCollectionById(id);
      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      const updatedCollection = await this.prismaService.collection.update({
        where: { id },
        data: {
          ...collectionData,
          products: productIds
            ? { set: productIds.map((id) => ({ id })) }
            : undefined,
        },
        include: { products: true },
      });

      return updatedCollection;
    } catch (error) {
      this.logger.error(`Error updating collection ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<CollectionWithRelations> {
    try {
      const collection = await this.getCollectionById(id);
      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      // Use transaction to handle related data if needed
      const deletedCollection = await this.prismaService.$transaction(
        async (prisma) => {
          // Remove all product associations first
          await prisma.collection.update({
            where: { id },
            data: {
              products: {
                set: [], // Remove all product connections
              },
            },
          });

          // Then delete the collection
          return prisma.collection.delete({
            where: { id },
          });
        }
      );

      return deletedCollection;
    } catch (error) {
      this.logger.error(`Error deleting collection ${id}:`, error);
      throw error;
    }
  }

  async isSlugUnique(
    slug: string,
    storeId: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const existingCollection = await this.prismaService.collection.findFirst({
        where: {
          slug,
          storeId,
          id: excludeId ? { not: excludeId } : undefined,
        },
      });
      return !existingCollection;
    } catch (error) {
      this.logger.error(`Error validating slug uniqueness for ${slug}:`, error);
      throw error;
    }
  }

  async addProductsToCollection(
    collectionId: string,
    productIds: string[]
  ): Promise<CollectionWithRelations> {
    try {
      const collection = await this.getCollectionById(collectionId);
      if (!collection) {
        throw new NotFoundException(
          `Collection with ID ${collectionId} not found`
        );
      }

      const updatedCollection = await this.prismaService.collection.update({
        where: { id: collectionId },
        data: {
          products: {
            connect: productIds.map((id) => ({ id })),
          },
        },
        include: { products: true },
      });

      return updatedCollection;
    } catch (error) {
      this.logger.error(
        `Error adding products to collection ${collectionId}:`,
        error
      );
      throw error;
    }
  }

  async removeProductsFromCollection(
    collectionId: string,
    productIds: string[]
  ): Promise<CollectionWithRelations> {
    try {
      const collection = await this.getCollectionById(collectionId);
      if (!collection) {
        throw new NotFoundException(
          `Collection with ID ${collectionId} not found`
        );
      }

      const updatedCollection = await this.prismaService.collection.update({
        where: { id: collectionId },
        data: {
          products: {
            disconnect: productIds.map((id) => ({ id })),
          },
        },
        include: { products: true },
      });

      return updatedCollection;
    } catch (error) {
      this.logger.error(
        `Error removing products from collection ${collectionId}:`,
        error
      );
      throw error;
    }
  }

  async findCollectionStore(collectionId: string): Promise<Store> {
    try {
      const store = await this.prismaService.store.findFirst({
        where: {
          collections: {
            some: {
              id: collectionId,
            },
          },
        },
      });

      if (!store) {
        throw new NotFoundException(
          `Store for collection ${collectionId} not found`
        );
      }

      return store;
    } catch (error) {
      this.logger.error(
        `Error finding store for collection ${collectionId}:`,
        error
      );
      throw error;
    }
  }

  async findCollectionProducts(collectionId: string): Promise<Product[]> {
    try {
      const products = await this.prismaService.product.findMany({
        where: {
          collections: {
            some: {
              id: collectionId,
            },
          },
        },
      });

      return products;
    } catch (error) {
      this.logger.error(
        `Error finding products for collection ${collectionId}:`,
        error
      );
      throw error;
    }
  }

  async getCollectionsForProduct(
    productId: string
  ): Promise<CollectionWithRelations[]> {
    try {
      const collections = await this.prismaService.collection.findMany({
        where: {
          products: {
            some: {
              id: productId,
            },
          },
        },
        include: { products: true },
      });

      return collections;
    } catch (error) {
      this.logger.error(
        `Error finding collections for product ${productId}:`,
        error
      );
      throw error;
    }
  }

  async bulkDelete(collectionIds: string[]): Promise<number> {
    try {
      // Use transaction to ensure data consistency
      const result = await this.prismaService.$transaction(async (prisma) => {
        // First, get all collections to be deleted
        const collections = await prisma.collection.findMany({
          where: {
            id: { in: collectionIds }
          },
          include: {
            products: true
          }
        });

        // Disconnect products from each collection
        await Promise.all(
          collections.map(collection =>
            prisma.collection.update({
              where: { id: collection.id },
              data: {
                products: {
                  disconnect: collection.products.map(product => ({ id: product.id }))
                }
              }
            })
          )
        );

        // Then delete the collections
        const deleteResult = await prisma.collection.deleteMany({
          where: {
            id: {
              in: collectionIds
            }
          }
        });

        return deleteResult.count;
      });

      return result;
    } catch (error) {
      this.logger.error(`Error bulk deleting collections:`, error);
      throw error;
    }
  }

  async bulkUpdate(
    collectionIds: string[],
    data: CollectionBulkUpdateData
  ): Promise<number> {
    try {
      const updateData: Prisma.CollectionUpdateManyMutationInput = {
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.description !== undefined && { description: data.description }),
        updatedAt: new Date()
      };

      const result = await this.prismaService.collection.updateMany({
        where: {
          id: {
            in: collectionIds
          }
        },
        data: updateData
      });

      return result.count;
    } catch (error) {
      this.logger.error(`Error bulk updating collections:`, error);
      throw error;
    }
  }

  async validateCollectionsOwnership(
    collectionIds: string[],
    storeId: string
  ): Promise<boolean> {
    const collections = await this.prismaService.collection.findMany({
      where: {
        id: { in: collectionIds },
        storeId
      },
      select: { id: true }
    });

    return collections.length === collectionIds.length;
  }
}
