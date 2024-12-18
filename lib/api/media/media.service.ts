import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import { Media, MediaOwnerType, Prisma } from '@prisma/client';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { paginate } from '@/api/pagination/paginate';
import { MediaSearchInput } from './media.dto';
import { MediaUsage } from './media.entity';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Query Methods
  async search(
    searchParams: MediaSearchInput,
    args?: PaginationArgs
  ): Promise<Media[]> {
    try {
      const where: Prisma.MediaWhereInput = {
        isArchived: false,
        ...(searchParams.id && { id: searchParams.id }),
        ...(searchParams.ownerId && { ownerId: searchParams.ownerId }),
        ...(searchParams.ownerType && { ownerType: searchParams.ownerType }),
        ...(searchParams.type && { type: searchParams.type }),
        ...(searchParams.storeId && { storeId: searchParams.storeId }),
        ...(searchParams.search && {
          OR: [
            {
              fileName: { contains: searchParams.search, mode: 'insensitive' },
            },
            { alt: { contains: searchParams.search, mode: 'insensitive' } },
          ],
        }),
      };

      return paginate({
        modelDelegate: this.prisma.media,
        args,
        where,
        orderBy: { position: 'asc' },
      });
    } catch (error) {
      this.logger.error('Failed to search media:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Media | null> {
    try {
      return this.prisma.media.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error fetching media with ID ${id}:`, error);
      throw error;
    }
  }

  async findByOwner(
    ownerId: string,
    ownerType: MediaOwnerType,
    args?: PaginationArgs
  ): Promise<Media[]> {
    try {
      return paginate({
        modelDelegate: this.prisma.media,
        args,
        where: {
          ownerId,
          ownerType,
          isArchived: false,
        },
        orderBy: { position: 'asc' },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching media for owner ${ownerId} of type ${ownerType}:`,
        error
      );
      throw error;
    }
  }

  // Create Operation
  async create(input: Prisma.MediaCreateInput): Promise<Media> {
    try {
      // Get next position for the owner
      const lastPosition = await this.prisma.media.findFirst({
        where: {
          ownerId: input.ownerId,
          ownerType: input.ownerType,
        },
        orderBy: { position: 'desc' },
        select: { position: true },
      });

      const position = (lastPosition?.position ?? -1) + 1;

      return this.prisma.media.create({
        data: {
          ...input,
          position,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create media:', error);
      throw error;
    }
  }

  // Update Operation
  async update(id: string, input: Prisma.MediaUpdateInput): Promise<Media> {
    try {
      const media = await this.findById(id);
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }

      return this.prisma.media.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      this.logger.error(`Failed to update media ${id}:`, error);
      throw error;
    }
  }

  // Delete Operation
  async delete(id: string): Promise<Media> {
    try {
      const media = await this.findById(id);
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }

      return this.prisma.media.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to delete media ${id}:`, error);
      throw error;
    }
  }

  // Archive Operation
  async archive(id: string): Promise<Media> {
    try {
      const media = await this.findById(id);
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }

      return this.prisma.media.update({
        where: { id },
        data: {
          isArchived: true,
          archivedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to archive media ${id}:`, error);
      throw error;
    }
  }

  // Position Management
  async updatePosition(id: string, newPosition: number): Promise<Media> {
    try {
      const media = await this.findById(id);
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }

      // Get all media for the same owner
      const ownerMedia = await this.prisma.media.findMany({
        where: {
          ownerId: media.ownerId,
          ownerType: media.ownerType,
          isArchived: false,
        },
        orderBy: { position: 'asc' },
      });

      const currentIndex = ownerMedia.findIndex((m) => m.id === id);
      const maxPosition = ownerMedia.length - 1;
      const safeNewPosition = Math.max(0, Math.min(newPosition, maxPosition));

      if (currentIndex === safeNewPosition) {
        return media;
      }

      // Update positions in transaction
      return await this.prisma.$transaction(async (tx) => {
        if (currentIndex < safeNewPosition) {
          // Moving forward
          await tx.media.updateMany({
            where: {
              ownerId: media.ownerId,
              ownerType: media.ownerType,
              position: {
                gt: currentIndex,
                lte: safeNewPosition,
              },
            },
            data: {
              position: { decrement: 1 },
            },
          });
        } else {
          // Moving backward
          await tx.media.updateMany({
            where: {
              ownerId: media.ownerId,
              ownerType: media.ownerType,
              position: {
                gte: safeNewPosition,
                lt: currentIndex,
              },
            },
            data: {
              position: { increment: 1 },
            },
          });
        }

        return tx.media.update({
          where: { id },
          data: { position: safeNewPosition },
        });
      });
    } catch (error) {
      this.logger.error(`Failed to update position for media ${id}:`, error);
      throw error;
    }
  }

  // Bulk Operations
  async reorderMedia(
    ownerId: string,
    ownerType: MediaOwnerType,
    orderedIds: string[]
  ): Promise<Media[]> {
    try {
      await this.prisma.$transaction(
        orderedIds.map((id, index) =>
          this.prisma.media.update({
            where: { id },
            data: { position: index },
          })
        )
      );

      return this.findByOwner(ownerId, ownerType);
    } catch (error) {
      this.logger.error(
        `Failed to reorder media for owner ${ownerId} of type ${ownerType}:`,
        error
      );
      throw error;
    }
  }

  async bulkDelete(ids: string[]): Promise<number> {
    try {
      const result = await this.prisma.media.deleteMany({
        where: { id: { in: ids } },
      });

      return result.count;
    } catch (error) {
      this.logger.error('Failed to bulk delete media:', error);
      throw error;
    }
  }

  async bulkArchive(ids: string[]): Promise<number> {
    try {
      const result = await this.prisma.media.updateMany({
        where: { id: { in: ids } },
        data: {
          isArchived: true,
          archivedAt: new Date(),
        },
      });

      return result.count;
    } catch (error) {
      this.logger.error('Failed to bulk archive media:', error);
      throw error;
    }
  }

  // Owner Resolution Methods
  async resolveOwner(
    media: Pick<Media, 'id' | 'ownerType' | 'ownerId'>
  ): Promise<any> {
    try {
      switch (media.ownerType) {
        case MediaOwnerType.STORE_PROFILE:
          return this.prisma.store.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.PRODUCT:
          return this.prisma.product.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.PRODUCT_VARIANT:
          return this.prisma.productVariant.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.COLLECTION:
          return this.prisma.collection.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.CATEGORY:
          return this.prisma.category.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.USER_PROFILE:
          return this.prisma.user.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.PROPERTY:
          return this.prisma.propertyListing.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.VEHICLE:
          return this.prisma.vehicleListing.findUnique({
            where: { id: media.ownerId },
          });
        default:
          return null;
      }
    } catch (error) {
      this.logger.error(
        `Failed to resolve owner for media ${media.id}:`,
        error
      );
      throw error;
    }
  }

  // Utility Methods
  async isOwnerValid(
    ownerId: string,
    ownerType: MediaOwnerType
  ): Promise<boolean> {
    try {
      const owner = await this.resolveOwner({
        id: '',
        ownerId,
        ownerType,
      } as Media);
      return !!owner;
    } catch (error) {
      return false;
    }
  }

  async findMediaUsage(id: string): Promise<MediaUsage[]> {
    try {
      const media = await this.prisma.media.findUnique({
        where: { id },
        select: {
          ownerType: true,
          ownerId: true,
          storeId: true,
        },
      });

      if (!media) {
        return [];
      }

      const usage: MediaUsage[] = [];

      switch (media.ownerType) {
        case MediaOwnerType.PRODUCT:
          const product = await this.prisma.product.findUnique({
            where: { id: media.ownerId },
            select: {
              id: true,
              title: true,
            },
          });

          if (product) {
            usage.push({
              ownerType: MediaOwnerType.PRODUCT,
              ownerId: product.id,
              ownerTitle: product.title,
            });
          }
          break;

        case MediaOwnerType.PRODUCT_VARIANT:
          const variant = await this.prisma.productVariant.findUnique({
            where: { id: media.ownerId },
            select: {
              id: true,
              optionCombination: true,
              productId: true,
            },
          });

          if (variant) {
            // Get the product title
            const variantProduct = await this.prisma.product.findUnique({
              where: { id: variant.productId },
              select: { title: true },
            });

            if (variantProduct) {
              usage.push({
                ownerType: MediaOwnerType.PRODUCT_VARIANT,
                ownerId: variant.id,
                ownerTitle: `${
                  variantProduct.title
                } - ${variant.optionCombination.join(' / ')}`,
              });
            }
          }
          break;

        case MediaOwnerType.CATEGORY:
          const category = await this.prisma.category.findUnique({
            where: { id: media.ownerId },
            select: { id: true, name: true },
          });

          if (category) {
            usage.push({
              ownerType: MediaOwnerType.CATEGORY,
              ownerId: category.id,
              ownerTitle: category.name,
            });
          }
          break;

        case MediaOwnerType.COLLECTION:
          const collection = await this.prisma.collection.findUnique({
            where: { id: media.ownerId },
            select: { id: true, name: true },
          });

          if (collection) {
            usage.push({
              ownerType: MediaOwnerType.COLLECTION,
              ownerId: collection.id,
              ownerTitle: collection.name,
            });
          }
          break;

        case MediaOwnerType.STORE_PROFILE:
          const store = await this.prisma.store.findUnique({
            where: { id: media.ownerId },
            select: { id: true, name: true },
          });

          if (store) {
            usage.push({
              ownerType: MediaOwnerType.STORE_PROFILE,
              ownerId: store.id,
              ownerTitle: store.name,
            });
          }
          break;

        case MediaOwnerType.USER_PROFILE:
          const user = await this.prisma.user.findUnique({
            where: { id: media.ownerId },
            select: { id: true, firstName: true, lastName: true, email: true },
          });

          if (user) {
            usage.push({
              ownerType: MediaOwnerType.USER_PROFILE,
              ownerId: user.id,
              ownerTitle:
                user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email,
            });
          }
          break;
      }

      return usage;
    } catch (error) {
      this.logger.error(`Failed to get usage info for media ${id}:`, error);
      throw error;
    }
  }
}
