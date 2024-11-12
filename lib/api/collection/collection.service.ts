import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import { Collection, Product, Prisma, Store } from '@prisma/client';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { paginate } from '@/api/pagination/paginate';

type CollectionWithRelations = Collection & {
  store?: Store;
  products?: Product[];
};

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getCollectionById(id: string): Promise<CollectionWithRelations | null> {
    try {
      const collection = await this.prismaService.collection.findUnique({
        where: { id }
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
        where: { storeId }
      });

      return collections;
    } catch (error) {
      this.logger.error(`Error fetching collections for store ${storeId}:`, error);
      throw error;
    }
  }

  async create(data: Prisma.CollectionUncheckedCreateInput): Promise<CollectionWithRelations> {
    try {
      const collection = await this.prismaService.collection.create({
        data
      });

      return collection;
    } catch (error) {
      this.logger.error('Error creating collection:', error);
      throw error;
    }
  }

  async update(
    id: string,
    data: Prisma.CollectionUncheckedUpdateInput
  ): Promise<CollectionWithRelations> {
    try {
      const collection = await this.getCollectionById(id);
      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      const updatedCollection = await this.prismaService.collection.update({
        where: { id },
        data
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
      const deletedCollection = await this.prismaService.$transaction(async (prisma) => {
        // Remove all product associations first
        await prisma.collection.update({
          where: { id },
          data: {
            products: {
              set: [] // Remove all product connections
            }
          }
        });

        // Then delete the collection
        return prisma.collection.delete({
          where: { id }
        });
      });

      return deletedCollection;
    } catch (error) {
      this.logger.error(`Error deleting collection ${id}:`, error);
      throw error;
    }
  }

  async isSlugUnique(slug: string, storeId: string, excludeId?: string): Promise<boolean> {
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
        throw new NotFoundException(`Collection with ID ${collectionId} not found`);
      }

      const updatedCollection = await this.prismaService.collection.update({
        where: { id: collectionId },
        data: {
          products: {
            connect: productIds.map(id => ({ id }))
          }
        }
      });

      return updatedCollection;
    } catch (error) {
      this.logger.error(`Error adding products to collection ${collectionId}:`, error);
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
        throw new NotFoundException(`Collection with ID ${collectionId} not found`);
      }

      const updatedCollection = await this.prismaService.collection.update({
        where: { id: collectionId },
        data: {
          products: {
            disconnect: productIds.map(id => ({ id }))
          }
        }
      });

      return updatedCollection;
    } catch (error) {
      this.logger.error(`Error removing products from collection ${collectionId}:`, error);
      throw error;
    }
  }

  async findCollectionStore(collectionId: string): Promise<Store> {
    try {
      const store = await this.prismaService.store.findFirst({
        where: {
          collections: {
            some: {
              id: collectionId
            }
          }
        }
      });

      if (!store) {
        throw new NotFoundException(`Store for collection ${collectionId} not found`);
      }

      return store;
    } catch (error) {
      this.logger.error(`Error finding store for collection ${collectionId}:`, error);
      throw error;
    }
  }

  async findCollectionProducts(collectionId: string): Promise<Product[]> {
    try {
      const products = await this.prismaService.product.findMany({
        where: {
          collections: {
            some: {
              id: collectionId
            }
          }
        }
      });

      return products;
    } catch (error) {
      this.logger.error(`Error finding products for collection ${collectionId}:`, error);
      throw error;
    }
  }

  async getCollectionsForProduct(productId: string): Promise<CollectionWithRelations[]> {
    try {
      const collections = await this.prismaService.collection.findMany({
        where: {
          products: {
            some: {
              id: productId
            }
          }
        }
      });

      return collections;
    } catch (error) {
      this.logger.error(`Error finding collections for product ${productId}:`, error);
      throw error;
    }
  }
}
