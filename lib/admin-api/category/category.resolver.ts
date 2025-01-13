import {
  Args,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

import {
  CategoryGetArgs,
  GetCategoriesByStoreTypeArgs,
} from './category.dto';

@Resolver(() => Category)
export class CategoryResolver {
  private readonly logger = new Logger(CategoryResolver.name);

  constructor(private readonly categoryService: CategoryService) {}

  // Queries
  @Query(() => Category, { nullable: true })
  async category(@Args() args: CategoryGetArgs): Promise<Category | null> {
    return this.categoryService.findById(args.id);
  }

  @Query(() => [Category])
  async categoriesByStoreType(
    @Args() args: GetCategoriesByStoreTypeArgs
  ): Promise<Category[]> {
    return this.categoryService.findByStoreType(args.storeType);
  }

  // Field Resolvers
  @ResolveField(() => Category, { nullable: true })
  async parent(@Parent() category: Category): Promise<Category | null> {
    if (!category.parentId) return null;
    return this.categoryService.findById(category.parentId);
  }

  @ResolveField(() => [Category])
  async children(@Parent() category: Category): Promise<Category[]> {
    return this.categoryService.findByParentId(category.id);
  }
}
