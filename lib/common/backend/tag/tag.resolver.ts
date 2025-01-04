import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  Logger,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { TagGetArgs, TagCreateInput, TagUpdateInput } from './tag.dto';
import { PaginationArgs } from '@/lib/common/backend/pagination/pagination.args';
import { JwtAuthGuard } from '@/common/backend/authentication/guard/jwt-auth.guard';
import { AuthContext } from '../utils/auth';
import { Store } from '@/common/backend/store/store.entity';
import { StoreService } from '@/common/backend/store/store.service';
import { Product } from '../../../admin-api/product/entities/product.entity';

@Resolver(() => Tag)
export class TagResolver {
  private readonly logger = new Logger(TagResolver.name);

  constructor(
    private readonly tagService: TagService,
    private readonly storeService: StoreService,
  ) {}

  private async validateTagOwnership(
    tagId: string,
    userId: string,
  ): Promise<Tag> {
    const tag = await this.tagService.getTagById(tagId);

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    const store = await this.storeService.getStoreById(tag.storeId);

    if (!store || store.ownerId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to access this tag',
      );
    }

    return tag;
  }

  // Query Methods
  @UseGuards(JwtAuthGuard)
  @Query(() => Tag)
  async tag(
    @Args() args: TagGetArgs,
    @Context() context: AuthContext,
  ): Promise<Tag> {
    await this.validateTagOwnership(args.id, context.req.user.id);
    const tag = await this.tagService.getTagById(args.id);
    
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${args.id} not found`);
    }

    return tag;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Tag])
  async storeTags(
    @Args('storeId') storeId: string,
    @Args() args: PaginationArgs,
    @Context() context: AuthContext,
  ): Promise<Tag[]> {
    const store = await this.storeService.getStoreById(storeId);

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    if (store.ownerId !== context.req.user.id) {
      throw new UnauthorizedException(
        'You do not have permission to access this store',
      );
    }

    return this.tagService.getTagsByStoreId(storeId, args);
  }

  // Mutation Methods
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Tag)
  async createTag(
    @Args('input') input: TagCreateInput,
    @Context() context: AuthContext,
  ): Promise<Tag> {
    try {
      const store = await this.storeService.getStoreById(input.storeId);

      if (!store) {
        throw new NotFoundException(`Store with ID ${input.storeId} not found`);
      }

      if (store.ownerId !== context.req.user.id) {
        throw new UnauthorizedException(
          'You do not have permission to create tags for this store',
        );
      }

      const isSlugUnique = await this.tagService.isSlugUnique(
        input.slug,
        input.storeId,
      );
      if (!isSlugUnique) {
        throw new BadRequestException('Tag slug is already taken in this store');
      }

      return await this.tagService.create(input);
    } catch (error) {
      this.logger.error('Failed to create tag:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Tag)
  async updateTag(
    @Args('input') input: TagUpdateInput,
    @Context() context: AuthContext,
  ): Promise<Tag> {
    try {
      await this.validateTagOwnership(input.id, context.req.user.id);
      return await this.tagService.update(input.id, input);
    } catch (error) {
      this.logger.error(`Failed to update tag ${input.id}:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteTag(
    @Args('id') id: string,
    @Context() context: AuthContext,
  ): Promise<boolean> {
    try {
      await this.validateTagOwnership(id, context.req.user.id);
      await this.tagService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete tag ${id}:`, error);
      throw error;
    }
  }

  // Resolve Fields
  @ResolveField(() => Store)
  async store(@Parent() tag: Tag): Promise<Store> {
    const store = await this.storeService.getStoreById(tag.storeId);
    if (!store) {
      throw new NotFoundException(`Store with ID ${tag.storeId} not found`);
    }
    return store;
  }

  @ResolveField(() => [Product])
  async products(@Parent() tag: Tag): Promise<Product[]> {
    return this.tagService.getTagProducts(tag.id);
  }
}
