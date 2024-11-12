import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  ForbiddenException,
  Logger,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { Store } from '../store/store.entity';
import { Category } from '../category/category.entity';
import { Collection } from '../collection/collection.entity';
import { Tag } from '../tag/tag.entity';
import { Media } from '../media/media.entity';
import { ProductOption } from './entities/product-option.entity';
import { ProductVariant } from './entities/product-variant.entity';
import {
  ProductCreateInput,
  ProductUpdateInput,
  ProductFiltersInput,
  BulkProductUpdateInput,
  BulkProductDeleteInput,
  ProductGetArgs,
  ProductGetBySlugArgs,
  GetMyStoreProductsArgs,
} from './product.dto';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { JwtAuthGuard } from '@/api/auth/guard/jwt-auth.guard';
import { AuthContext } from '@/api/utils/auth';
import { StoreService } from '../store/store.service';

@Resolver(() => Product)
export class ProductResolver {
  private readonly logger = new Logger(ProductResolver.name);

  constructor(
    private readonly productService: ProductService,
    private readonly storeService: StoreService
  ) {}

  private async validateStoreAccess(
    storeId: string,
    userId: string,
    operation: string
  ): Promise<void> {
    const store = await this.storeService.getStoreById(storeId);

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    if (store.ownerId !== userId) {
      throw new ForbiddenException(
        `You don't have permission to ${operation} products in this store`
      );
    }
  }

  // Queries
  @Query(() => Product, { nullable: true })
  async product(@Args() args: ProductGetArgs): Promise<Product | null> {
    return this.productService.findById(args.id);
  }

  @Query(() => Product, { nullable: true })
  async productBySlug(@Args() args: ProductGetBySlugArgs): Promise<Product | null> {
    return this.productService.findBySlug(args.slug);
  }

  // Field Resolvers
  @UseGuards(JwtAuthGuard)
  @Query(() => [Product])
  async myStoreProducts(
    @Args() args: GetMyStoreProductsArgs,
    @Args() pagination: PaginationArgs,
    @Context() ctx: AuthContext,
    @Args('filters', { nullable: true }) filters?: ProductFiltersInput
  ): Promise<Product[]> {
    await this.validateStoreAccess(args.storeId, ctx.req.user.id, 'view');
    return this.productService.findByStore(args.storeId, pagination, filters);
  }

  @ResolveField(() => Store)
  async store(@Parent() product: Product): Promise<Store | null> {
    return this.productService.findProductStore(product.id);
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() product: Product): Promise<Category | null> {
    return this.productService.findProductCategory(product.id);
  }

  @ResolveField(() => [ProductOption])
  async options(@Parent() product: Product): Promise<ProductOption[]> {
    return this.productService.findProductOptions(product.id);
  }

  @ResolveField(() => [ProductVariant])
  async variants(@Parent() product: Product): Promise<ProductVariant[]> {
    return this.productService.findProductVariants(product.id);
  }

  @ResolveField(() => [Collection])
  async collections(@Parent() product: Product): Promise<Collection[]> {
    return this.productService.findProductCollections(product.id);
  }

  @ResolveField(() => [Tag])
  async tags(@Parent() product: Product): Promise<Tag[]> {
    return this.productService.findProductTags(product.id);
  }

  @ResolveField(() => [Media])
  async media(@Parent() product: Product): Promise<Media[]> {
    return this.productService.findProductMedia(product.id);
  }

  // Mutations
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: ProductCreateInput,
    @Context() ctx: AuthContext
  ): Promise<Product> {
    await this.validateStoreAccess(input.storeId, ctx.req.user.id, 'create');

    try {
      return await this.productService.create(input);
    } catch (error) {
      this.logger.error('Failed to create product:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Args('input') input: ProductUpdateInput,
    @Context() ctx: AuthContext
  ): Promise<Product> {
    const product = await this.productService.findById(input.id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${input.id} not found`);
    }

    await this.validateStoreAccess(product.storeId, ctx.req.user.id, 'update');

    try {
      return await this.productService.update(input);
    } catch (error) {
      this.logger.error(`Failed to update product ${input.id}:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('id') id: string,
    @Context() ctx: AuthContext
  ): Promise<boolean> {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.validateStoreAccess(product.storeId, ctx.req.user.id, 'delete');

    try {
      await this.productService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async bulkUpdateProducts(
    @Args('input') input: BulkProductUpdateInput,
    @Context() ctx: AuthContext
  ): Promise<number> {
    await this.validateStoreAccess(input.storeId, ctx.req.user.id, 'update');

    try {
      return await this.productService.bulkUpdate(
        input.storeId,
        input.productIds,
        input.data
      );
    } catch (error) {
      this.logger.error('Failed to bulk update products:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async bulkDeleteProducts(
    @Args('input') input: BulkProductDeleteInput,
    @Context() ctx: AuthContext
  ): Promise<number> {
    await this.validateStoreAccess(input.storeId, ctx.req.user.id, 'delete');

    try {
      return await this.productService.bulkDelete(
        input.storeId,
        input.productIds
      );
    } catch (error) {
      this.logger.error('Failed to bulk delete products:', error);
      throw error;
    }
  }
}
