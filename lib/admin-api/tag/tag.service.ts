import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Tag, Prisma, Product } from '@prisma/client';
import { PrismaService } from '@/lib/common/prisma/prisma.service';
import { PaginationArgs } from '@/lib/common/backend/pagination/pagination.args';
import { paginate } from '@/lib/common/backend/pagination/paginate';
import { TagCreateInput, TagUpdateInput } from './tag.dto';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(private readonly prismaService: PrismaService) {}

  // Query Methods
  async getTagById(id: string): Promise<Tag> {
    try {
      const tag = await this.prismaService.tag.findUnique({
        where: { id },
      });

      if (!tag) {
        throw new NotFoundException(`Tag with ID ${id} not found`);
      }

      return tag;
    } catch (error) {
      this.logger.error(`Error fetching tag with ID ${id}:`, error);
      throw error;
    }
  }

  async getTagsByStoreId(storeId: string, args?: PaginationArgs): Promise<Tag[]> {
    try {
      return paginate({
        modelDelegate: this.prismaService.tag,
        args,
        where: { storeId },
      });
    } catch (error) {
      this.logger.error(`Error fetching tags for store ${storeId}:`, error);
      throw error;
    }
  }

  async getTagProducts(tagId: string): Promise<Product[]> {
    try {
      const tag = await this.prismaService.tag.findUnique({
        where: { id: tagId },
        include: { products: true },
      });
      
      return tag?.products ?? [];
    } catch (error) {
      this.logger.error(`Error fetching products for tag ${tagId}:`, error);
      throw error;
    }
  }

  // Mutation Methods
  async create(input: TagCreateInput): Promise<Tag> {
    try {
      return this.prismaService.tag.create({
        data: {
          name: input.name,
          slug: input.slug,
          storeId: input.storeId,
        },
      });
    } catch (error) {
      this.logger.error('Error creating tag:', error);
      throw error;
    }
  }

  async update(id: string, input: TagUpdateInput): Promise<Tag> {
    try {
      const tag = await this.getTagById(id);
      if (!tag) {
        throw new NotFoundException(`Tag with ID ${id} not found`);
      }

      return this.prismaService.tag.update({
        where: { id },
        data: {
          name: input.name,
        },
      });
    } catch (error) {
      this.logger.error(`Error updating tag ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<Tag> {
    try {
      return this.prismaService.tag.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error deleting tag ${id}:`, error);
      throw error;
    }
  }

  // Validation Methods
  async isSlugUnique(slug: string, storeId: string): Promise<boolean> {
    try {
      const existingTag = await this.prismaService.tag.findFirst({
        where: {
          slug,
          storeId,
        },
      });
      return !existingTag;
    } catch (error) {
      this.logger.error(
        `Error validating slug uniqueness for ${slug} in store ${storeId}:`,
        error,
      );
      throw error;
    }
  }
}
