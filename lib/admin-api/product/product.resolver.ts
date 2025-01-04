import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Float,
} from '@nestjs/graphql';
import { Logger, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { Store } from '@/common/backend/store/store.entity';
import { Category } from '../../common/backend/category/category.entity';
import { Collection } from '../../common/backend/collection/collection.entity';
import { Tag } from '../../common/backend/tag/tag.entity';
import { Media } from '../../common/backend/media/media.entity';
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
import { PaginationArgs } from '@/lib/common/backend/pagination/pagination.args';
import { AuthContext } from '@/lib/common/backend/utils/auth';
import {
  AuthBulkProducts,
  AuthProduct,
  AuthStore,
} from '@/common/backend/authorization/decorators/auth.decorator';

@Resolver(() => Product)
export class ProductResolver {
  private readonly logger = new Logger(ProductResolver.name);

  constructor(private readonly productService: ProductService) {}

  // Queries
  @AuthProduct()
  @Query(() => Product, { nullable: true })
  async product(@Args() args: ProductGetArgs): Promise<Product | null> {
    return this.productService.findById(args.id);
  }

  @Query(() => Product, { nullable: true })
  async productBySlug(
    @Args() args: ProductGetBySlugArgs
  ): Promise<Product | null> {
    return this.productService.findBySlug(args.slug, args.storeId);
  }

  @AuthStore()
  @Query(() => [Product])
  async myStoreProducts(
    @Args() args: GetMyStoreProductsArgs,
    @Args() pagination: PaginationArgs,
    @Context() ctx: AuthContext,
    @Args('filters', { nullable: true }) filters?: ProductFiltersInput
  ): Promise<Product[]> {
    return this.productService.findByStore(args.storeId, pagination, filters);
  }

  // Field Resolvers
  @ResolveField(() => Store)
  async store(@Parent() product: Product): Promise<Store> {
    return this.productService.findProductStore(product.id);
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() product: Product): Promise<Category | null> {
    if (!product.categoryId) return null;
    return this.productService.findProductCategory(product.categoryId);
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

  // Default variant computed fields
  @ResolveField(() => Float)
  async price(@Parent() product: Product): Promise<number> {
    if ('price' in product && typeof product.price === 'number') {
      return product.price;
    }
    return this.productService.getPrice(product.id);
  }

  @ResolveField(() => Float, { nullable: true })
  async compareAtPrice(@Parent() product: Product): Promise<number | null> {
    if (
      'compareAtPrice' in product &&
      (typeof product.compareAtPrice === 'number' ||
        product.compareAtPrice === null)
    ) {
      return product.compareAtPrice;
    }
    return this.productService.getCompareAtPrice(product.id);
  }

  @ResolveField(() => String, { nullable: true })
  async sku(@Parent() product: Product): Promise<string | null> {
    if (
      'sku' in product &&
      (typeof product.sku === 'string' || product.sku === null)
    ) {
      return product.sku;
    }
    return this.productService.getSku(product.id);
  }

  @ResolveField(() => Int)
  async available(@Parent() product: Product): Promise<number> {
    if ('available' in product && typeof product.available === 'number') {
      return product.available;
    }
    return this.productService.getAvailable(product.id);
  }

  // Mutations
  @AuthStore()
  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: ProductCreateInput,
    @Context() ctx: AuthContext
  ): Promise<Product> {
    try {
      return await this.productService.create(input);
    } catch (error) {
      this.logger.error('Failed to create product:', error);
      throw error;
    }
  }

  @AuthProduct()
  @Mutation(() => Product)
  async updateProduct(
    @Args('input') input: ProductUpdateInput,
    @Context() ctx: AuthContext
  ): Promise<Product> {
    const product = await this.productService.findById(input.id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${input.id} not found`);
    }

    try {
      return await this.productService.update(input);
    } catch (error) {
      this.logger.error(`Failed to update product ${input.id}:`, error);
      throw error;
    }
  }

  @AuthProduct()
  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('id') id: string,
    @Context() ctx: AuthContext
  ): Promise<boolean> {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    try {
      await this.productService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  }

  @AuthBulkProducts()
  @Mutation(() => Int)
  async bulkUpdateProducts(
    @Args('input') input: BulkProductUpdateInput,
    @Context() ctx: AuthContext
  ): Promise<number> {
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

  @AuthBulkProducts()
  @Mutation(() => Int)
  async bulkDeleteProducts(
    @Args('input') input: BulkProductDeleteInput,
    @Context() ctx: AuthContext
  ): Promise<number> {
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
