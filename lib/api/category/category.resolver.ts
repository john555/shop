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
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { StoreService } from '../store/store.service';
import { PrismaService } from '@/api/prisma/prisma.service';
import {
  CategoryCreateInput,
  CategoryUpdateInput,
  GetCategoryBySlugArgs,
} from './category.dto';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';
import { AuthContext } from '../utils/auth';
import { DEFAULT_CATEGORY_INCLUDE } from './category.types';
import { Store } from '../store/store.entity';

@Resolver(() => Category)
export class CategoryResolver {
  private readonly logger = new Logger(CategoryResolver.name);

  constructor(
    private readonly categoryService: CategoryService,
    private readonly storeService: StoreService,
    private readonly prismaService: PrismaService
  ) {}

  private async validateStoreAccess(
    storeId: string,
    userId: string
  ): Promise<void> {
    const store = await this.storeService.getStoreById(storeId);
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    if (store.ownerId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to access this store'
      );
    }
  }

  @Query(() => Category, { nullable: true })
  async categoryBySlug(
    @Args() args: GetCategoryBySlugArgs
  ): Promise<Category | null> {
    return this.categoryService.getCategoryBySlug(
      args.slug,
      args.storeId,
      DEFAULT_CATEGORY_INCLUDE
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Category])
  async storeCategories(
    @Args('storeId') storeId: string,
    @Args() args: PaginationArgs,
    @Context() context: AuthContext
  ): Promise<Category[]> {
    await this.validateStoreAccess(storeId, context.req.user.id);
    return this.categoryService.getCategoriesByStoreId(
      storeId,
      args,
      DEFAULT_CATEGORY_INCLUDE
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Category)
  async createCategory(
    @Args('input') input: CategoryCreateInput,
    @Context() context: AuthContext
  ): Promise<Category> {
    try {
      await this.validateStoreAccess(input.storeId, context.req.user.id);

      // Validate slug uniqueness
      const isSlugUnique = await this.categoryService.isSlugUnique(
        input.slug,
        input.storeId
      );
      if (!isSlugUnique) {
        throw new BadRequestException(
          'Category slug is already taken in this store'
        );
      }

      // Validate parent category if provided
      if (input.parentId) {
        const parent = await this.categoryService.getCategoryById(
          input.parentId
        );
        if (!parent) {
          throw new NotFoundException(
            `Parent category with ID ${input.parentId} not found`
          );
        }
        if (parent.storeId !== input.storeId) {
          throw new BadRequestException(
            'Parent category must belong to the same store'
          );
        }
      }

      return await this.categoryService.create(input);
    } catch (error) {
      this.logger.error('Failed to create category:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Category)
  async updateCategory(
    @Args('input') input: CategoryUpdateInput,
    @Context() context: AuthContext
  ): Promise<Category> {
    try {
      const category = await this.categoryService.getCategoryById(input.id);
      if (!category) {
        throw new NotFoundException(`Category with ID ${input.id} not found`);
      }

      await this.validateStoreAccess(category.storeId, context.req.user.id);

      if (input.parentId && input.parentId !== category.parentId) {
        const parent = await this.categoryService.getCategoryById(
          input.parentId
        );
        if (!parent) {
          throw new NotFoundException(
            `Parent category with ID ${input.parentId} not found`
          );
        }
        if (parent.storeId !== category.storeId) {
          throw new BadRequestException(
            'Parent category must belong to the same store'
          );
        }
      }

      return await this.categoryService.update(input.id, input);
    } catch (error) {
      this.logger.error(`Failed to update category ${input.id}:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteCategory(
    @Args('id') id: string,
    @Context() context: AuthContext
  ): Promise<boolean> {
    try {
      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      await this.validateStoreAccess(category.storeId, context.req.user.id);
      await this.categoryService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete category ${id}:`, error);
      throw error;
    }
  }

  @ResolveField(() => Category, { nullable: true })
  async parent(@Parent() category: Category): Promise<Category | null> {
    if (!category.parentId) return null;
    return this.categoryService.getCategoryById(category.parentId);
  }

  @ResolveField(() => [Category])
  async children(@Parent() category: Category): Promise<Category[]> {
    return this.prismaService.category.findMany({
      where: { parentId: category.id },
    });
  }
}
