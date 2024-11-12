import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Media, MediaOwnerType } from '@prisma/client';
import { PrismaService } from '@/api/prisma/prisma.service';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { paginate } from '@/api/pagination/paginate';
import { MediaCreateData, MediaUpdateData } from './media.types';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getMediaById(id: string): Promise<Media | null> {
    try {
      return this.prismaService.media.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error fetching media with ID ${id}:`, error);
      throw error;
    }
  }

  async getMediaByOwner(
    ownerId: string,
    ownerType: MediaOwnerType,
    args?: PaginationArgs
  ): Promise<Media[]> {
    try {
      return paginate({
        modelDelegate: this.prismaService.media,
        args,
        where: { ownerId, ownerType },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching media for owner ${ownerId} of type ${ownerType}:`,
        error
      );
      throw error;
    }
  }

  async create(input: MediaCreateData): Promise<Media> {
    try {
      return this.prismaService.media.create({
        data: input,
      });
    } catch (error) {
      this.logger.error('Error creating media:', error);
      throw error;
    }
  }

  async update(id: string, input: MediaUpdateData): Promise<Media> {
    try {
      const media = await this.getMediaById(id);
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }

      return this.prismaService.media.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      this.logger.error(`Error updating media ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<Media> {
    try {
      const media = await this.getMediaById(id);
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }

      return this.prismaService.media.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error deleting media ${id}:`, error);
      throw error;
    }
  }

  async reorderMedia(
    ownerId: string,
    ownerType: MediaOwnerType,
    orderedIds: string[]
  ): Promise<Media[]> {
    try {
      // Update positions in transaction
      await this.prismaService.$transaction(
        orderedIds.map((id, index) =>
          this.prismaService.media.update({
            where: { id },
            data: { position: index },
          })
        )
      );

      // Return reordered media
      return this.getMediaByOwner(ownerId, ownerType);
    } catch (error) {
      this.logger.error(
        `Error reordering media for owner ${ownerId} of type ${ownerType}:`,
        error
      );
      throw error;
    }
  }

  async updateMediaPosition(id: string, newPosition: number): Promise<Media> {
    try {
      const media = await this.getMediaById(id);
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }

      // Get all media for the same owner
      const ownerMedia = await this.prismaService.media.findMany({
        where: {
          ownerId: media.ownerId,
          ownerType: media.ownerType,
        },
        orderBy: { position: 'asc' },
      });

      // Calculate position changes
      const currentIndex = ownerMedia.findIndex((m) => m.id === id);
      const maxPosition = ownerMedia.length - 1;
      const safeNewPosition = Math.max(0, Math.min(newPosition, maxPosition));

      if (currentIndex === safeNewPosition) {
        return media;
      }

      // Update positions in transaction
      await this.prismaService.$transaction(async (prisma) => {
        if (currentIndex < safeNewPosition) {
          // Moving forward: decrease position of items in between
          await prisma.media.updateMany({
            where: {
              ownerId: media.ownerId,
              ownerType: media.ownerType,
              position: {
                gt: currentIndex,
                lte: safeNewPosition,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          });
        } else {
          // Moving backward: increase position of items in between
          await prisma.media.updateMany({
            where: {
              ownerId: media.ownerId,
              ownerType: media.ownerType,
              position: {
                gte: safeNewPosition,
                lt: currentIndex,
              },
            },
            data: {
              position: {
                increment: 1,
              },
            },
          });
        }

        // Update the target media item's position
        await prisma.media.update({
          where: { id },
          data: { position: safeNewPosition },
        });
      });

      return this.getMediaById(id) as Promise<Media>;
    } catch (error) {
      this.logger.error(`Error updating position for media ${id}:`, error);
      throw error;
    }
  }

  async deleteAllMediaForOwner(
    ownerId: string,
    ownerType: MediaOwnerType
  ): Promise<number> {
    try {
      const result = await this.prismaService.media.deleteMany({
        where: {
          ownerId,
          ownerType,
        },
      });

      return result.count;
    } catch (error) {
      this.logger.error(
        `Error deleting all media for owner ${ownerId} of type ${ownerType}:`,
        error
      );
      throw error;
    }
  }

  // Methods for resolving fields
  async getOwner(media: Media): Promise<any> {
    try {
      switch (media.ownerType) {
        case MediaOwnerType.PRODUCT:
          return this.prismaService.product.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.PRODUCT_VARIANT:
          return this.prismaService.productVariant.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.CATEGORY:
          return this.prismaService.category.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.COLLECTION:
          return this.prismaService.collection.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.STORE:
          return this.prismaService.store.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.USER_PROFILE:
          return this.prismaService.user.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.PROPERTY:
          return this.prismaService.propertyListing.findUnique({
            where: { id: media.ownerId },
          });
        case MediaOwnerType.VEHICLE:
          return this.prismaService.vehicleListing.findUnique({
            where: { id: media.ownerId },
          });
        default:
          return null;
      }
    } catch (error) {
      this.logger.error(`Error resolving owner for media ${media.id}:`, error);
      throw error;
    }
  }
}
