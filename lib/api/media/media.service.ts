import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/api/prisma/prisma.service';
import { Media, MediaOwnerType, MediaType, Prisma } from '@prisma/client';
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
        ...(searchParams.storeId && { storeId: searchParams.storeId }),
        ...(searchParams.type && { type: searchParams.type }),
        ...((searchParams.ownerId || searchParams.ownerType) && {
          owners: {
            some: {
              ...(searchParams.ownerId && { ownerId: searchParams.ownerId }),
              ...(searchParams.ownerType && {
                ownerType: searchParams.ownerType,
              }),
            },
          },
        }),
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
        include: {
          owners: true,
        },
        orderBy: [
          {
            owners: {
              position: 'asc',
            },
          },
        ],
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
        include: {
          owners: true,
        },
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
          isArchived: false,
          owners: {
            some: {
              ownerId,
              ownerType,
            },
          },
        },
        include: {
          owners: {
            where: {
              ownerId,
              ownerType,
            },
          },
        },
        orderBy: [
          {
            owners: {
              position: 'asc',
            },
          }
        ],
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
  async create(
    input: Prisma.MediaCreateInput & {
      owners: { ownerId: string; ownerType: MediaOwnerType }[];
    }
  ): Promise<Media> {
    try {
      return this.prisma.$transaction(async (tx) => {
        // Create the media record
        const media = await tx.media.create({
          data: {
            type: input.type,
            url: input.url,
            alt: input.alt,
            fileName: input.fileName,
            mimeType: input.mimeType,
            fileSize: input.fileSize,
            width: input.width,
            height: input.height,
            duration: input.duration,
            thumbnail: input.thumbnail,
            modelFormat: input.modelFormat,
            purpose: input.purpose,
            blurHash: input.blurHash,
            placeholder: input.placeholder,
            storeId: input.storeId,
          },
        });

        // Create ownership records for each owner
        await Promise.all(
          input.owners.map(async (owner, index) => {
            const lastPosition = await tx.mediaOwnership.findFirst({
              where: {
                ownerId: owner.ownerId,
                ownerType: owner.ownerType,
              },
              orderBy: {
                position: 'desc',
              },
            });

            const position = (lastPosition?.position ?? -1) + 1;

            await tx.mediaOwnership.create({
              data: {
                mediaId: media.id,
                ownerId: owner.ownerId,
                ownerType: owner.ownerType,
                position,
              },
            });
          })
        );

        return media;
      });
    } catch (error) {
      this.logger.error('Failed to create media:', error);
      throw error;
    }
  }

  // Update Operation
  async update(
    id: string,
    input: Prisma.MediaUpdateInput & {
      addOwners?: { ownerId: string; ownerType: MediaOwnerType }[];
      removeOwners?: { ownerId: string; ownerType: MediaOwnerType }[];
    }
  ): Promise<Media> {
    try {
      const media = await this.findById(id);
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }

      return await this.prisma.$transaction(async (tx) => {
        // Update media record
        await tx.media.update({
          where: { id },
          data: {
            alt: input.alt,
            fileName: input.fileName,
            thumbnail: input.thumbnail,
          },
        });

        // Handle new owners
        if (input.addOwners?.length) {
          await Promise.all(
            input.addOwners.map(async (owner) => {
              const lastPosition = await tx.mediaOwnership.findFirst({
                where: {
                  ownerId: owner.ownerId,
                  ownerType: owner.ownerType,
                },
                orderBy: {
                  position: 'desc',
                },
              });

              const position = (lastPosition?.position ?? -1) + 1;

              await tx.mediaOwnership.create({
                data: {
                  mediaId: id,
                  ownerId: owner.ownerId,
                  ownerType: owner.ownerType,
                  position,
                },
              });
            })
          );
        }

        // Handle owner removals
        if (input.removeOwners?.length) {
          await Promise.all(
            input.removeOwners.map(async (owner) => {
              await tx.mediaOwnership.deleteMany({
                where: {
                  mediaId: id,
                  ownerId: owner.ownerId,
                  ownerType: owner.ownerType,
                },
              });

              // Reorder remaining media for this owner
              const remainingMedia = await tx.mediaOwnership.findMany({
                where: {
                  ownerId: owner.ownerId,
                  ownerType: owner.ownerType,
                },
                orderBy: {
                  position: 'asc',
                },
              });

              // Update positions
              await Promise.all(
                remainingMedia.map((media, index) =>
                  tx.mediaOwnership.update({
                    where: { id: media.id },
                    data: { position: index },
                  })
                )
              );
            })
          );
        }

        return this.findById(id) as Promise<Media>;
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
        include: {
          owners: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to delete media ${id}:`, error);
      throw error;
    }
  }

  // Reorder Operation
  async reorder(
    ownerId: string,
    ownerType: MediaOwnerType,
    mediaIds: string[]
  ): Promise<Media[]> {
    try {
      // First, move all items to temporary negative positions to avoid conflicts
      await this.prisma.$transaction(
        mediaIds.map((mediaId, index) =>
          this.prisma.mediaOwnership.updateMany({
            where: {
              mediaId,
              ownerId,
              ownerType,
            },
            data: {
              position: -(index + 1), // Temporary negative position
            },
          })
        )
      );
  
      // Then, set the final positions
      await this.prisma.$transaction(
        mediaIds.map((mediaId, index) =>
          this.prisma.mediaOwnership.updateMany({
            where: {
              mediaId,
              ownerId,
              ownerType,
            },
            data: {
              position: index,
            },
          })
        )
      );
  
      return this.findByOwner(ownerId, ownerType);
    } catch (error) {
      this.logger.error('Failed to reorder media:', error);
      throw error;
    }
  }

  // Owner Resolution Method
  async resolveOwner<T>({
    ownerType,
    ownerId,
  }: {
    ownerType: MediaOwnerType;
    ownerId: string;
  }): Promise<T | null> {
    try {
      switch (ownerType) {
        case MediaOwnerType.PRODUCT:
          return this.prisma.product.findUnique({
            where: { id: ownerId },
            include: {
              variants: {
                where: {
                  optionCombination: { equals: ['Default'] },
                },
              },
            },
          }) as unknown as Promise<T>;

        case MediaOwnerType.PRODUCT_VARIANT:
          return this.prisma.productVariant.findUnique({
            where: { id: ownerId },
          }) as unknown as Promise<T>;

        case MediaOwnerType.CATEGORY:
          return this.prisma.category.findUnique({
            where: { id: ownerId },
          }) as unknown as Promise<T>;

        case MediaOwnerType.COLLECTION:
          return this.prisma.collection.findUnique({
            where: { id: ownerId },
          }) as unknown as Promise<T>;

        case MediaOwnerType.STORE_PROFILE:
          return this.prisma.store.findUnique({
            where: { id: ownerId },
          }) as unknown as Promise<T>;

        case MediaOwnerType.USER_PROFILE:
          return this.prisma.user.findUnique({
            where: { id: ownerId },
          }) as unknown as Promise<T>;

        default:
          return null;
      }
    } catch (error) {
      this.logger.error(
        `Failed to resolve owner ${ownerId} of type ${ownerType}:`,
        error
      );
      return null;
    }
  }

  // Media Usage Method
  async findMediaUsage(id: string): Promise<MediaUsage[]> {
    try {
      const media = await this.prisma.media.findUnique({
        where: { id },
        include: {
          owners: true,
        },
      });

      if (!media?.owners) {
        return [];
      }

      const usagePromises = media.owners.map(async (owner) => {
        const ownerEntity = await this.resolveOwner({
          ownerType: owner.ownerType,
          ownerId: owner.ownerId,
        });

        if (!ownerEntity) return null;

        const ownerTitle = this.getOwnerTitle(owner.ownerType, ownerEntity);

        return {
          ownerType: owner.ownerType,
          ownerId: owner.ownerId,
          ownerTitle,
        };
      });

      const usages = await Promise.all(usagePromises);
      return usages.filter((usage): usage is MediaUsage => usage !== null);
    } catch (error) {
      this.logger.error(`Failed to get usage info for media ${id}:`, error);
      return [];
    }
  }

  private getOwnerTitle(ownerType: MediaOwnerType, owner: any): string {
    switch (ownerType) {
      case MediaOwnerType.PRODUCT:
        return owner.title;
      case MediaOwnerType.PRODUCT_VARIANT:
        return `${
          owner.product?.title || 'Product'
        } - ${owner.optionCombination.join(' / ')}`;
      case MediaOwnerType.CATEGORY:
      case MediaOwnerType.COLLECTION:
        return owner.name;
      case MediaOwnerType.STORE_PROFILE:
        return owner.name;
      case MediaOwnerType.USER_PROFILE:
        return owner.firstName && owner.lastName
          ? `${owner.firstName} ${owner.lastName}`
          : owner.email;
      default:
        return 'Unknown Owner';
    }
  }

  // Validation Methods
  async validateOwner(
    ownerId: string,
    ownerType: MediaOwnerType
  ): Promise<boolean> {
    try {
      const owner = await this.resolveOwner({
        ownerType,
        ownerId,
      });
      return !!owner;
    } catch (error) {
      this.logger.error(
        `Failed to validate owner ${ownerId} of type ${ownerType}:`,
        error
      );
      return false;
    }
  }

  async validateMediaAccess(
    mediaId: string,
    storeId: string
  ): Promise<boolean> {
    try {
      const media = await this.prisma.media.findFirst({
        where: {
          id: mediaId,
          storeId,
        },
      });
      return !!media;
    } catch (error) {
      this.logger.error(
        `Failed to validate media access for media ${mediaId} and store ${storeId}:`,
        error
      );
      return false;
    }
  }

  // Archive Methods
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
        include: {
          owners: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to archive media ${id}:`, error);
      throw error;
    }
  }

  async bulkArchive(ids: string[]): Promise<number> {
    try {
      const result = await this.prisma.media.updateMany({
        where: {
          id: { in: ids },
        },
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

  // Bulk Operations
  async bulkDelete(ids: string[]): Promise<number> {
    try {
      const result = await this.prisma.media.deleteMany({
        where: {
          id: { in: ids },
        },
      });

      return result.count;
    } catch (error) {
      this.logger.error('Failed to bulk delete media:', error);
      throw error;
    }
  }

  async bulkAddOwner(
    mediaIds: string[],
    ownerId: string,
    ownerType: MediaOwnerType
  ): Promise<number> {
    try {
      const lastPosition = await this.prisma.mediaOwnership.findFirst({
        where: {
          ownerId,
          ownerType,
        },
        orderBy: {
          position: 'desc',
        },
      });

      let startPosition = (lastPosition?.position ?? -1) + 1;

      await this.prisma.$transaction(
        mediaIds.map((mediaId) =>
          this.prisma.mediaOwnership.create({
            data: {
              mediaId,
              ownerId,
              ownerType,
              position: startPosition++,
            },
          })
        )
      );

      return mediaIds.length;
    } catch (error) {
      this.logger.error('Failed to bulk add owner to media:', error);
      throw error;
    }
  }

  async bulkRemoveOwner(
    mediaIds: string[],
    ownerId: string,
    ownerType: MediaOwnerType
  ): Promise<number> {
    try {
      const result = await this.prisma.mediaOwnership.deleteMany({
        where: {
          mediaId: { in: mediaIds },
          ownerId,
          ownerType,
        },
      });

      // Reorder remaining media for this owner
      const remainingMedia = await this.prisma.mediaOwnership.findMany({
        where: {
          ownerId,
          ownerType,
        },
        orderBy: {
          position: 'asc',
        },
      });

      await this.prisma.$transaction(
        remainingMedia.map((media, index) =>
          this.prisma.mediaOwnership.update({
            where: { id: media.id },
            data: { position: index },
          })
        )
      );

      return result.count;
    } catch (error) {
      this.logger.error('Failed to bulk remove owner from media:', error);
      throw error;
    }
  }
}
