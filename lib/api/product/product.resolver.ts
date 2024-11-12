import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
  Int,
} from '@nestjs/graphql';
import { UseGuards, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Store } from '../store/store.entity';
import { Category } from '../category/category.entity';
import { Collection } from '../collection/collection.entity';
import { Tag } from '../tag/tag.entity';
import { Media } from '../media/media.entity';
import { ProductOption } from './entities/product-option.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductService } from './product.service';
import { StoreService } from '../store/store.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { 
  ProductCreateInput,
  ProductUpdateInput,
  ProductFiltersInput,
  ProductOptionInput,
  ProductVariantInput,
  BulkProductUpdateInput,
  BulkProductDeleteInput,
  GetProductBySlugArgs,
  ProductGetArgs
} from './product.dto';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { AuthContext } from '../utils/auth';
import { Product } from './entities/product.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
  ) {}

  // Queries
  @Query(() => Product, { nullable: true })
  async product(
    @Args() args: ProductGetArgs
  ): Promise<Product | null> {
    return this.productService.findById(args.id);
  }

  @Query(() => Product, { nullable: true })
  async productBySlug(
    @Args() args: GetProductBySlugArgs
  ): Promise<Product | null> {
    return this.productService.findBySlug(args.slug);
  }

  @Query(() => [Product])
  async storeProducts(
    @Args('storeId') storeId: string,
    @Args() pagination: PaginationArgs,
    @Args('filters', { nullable: true }) filters?: ProductFiltersInput
  ): Promise<Product[]> {
    return this.productService.findByStore(storeId, pagination, filters);
  }

  // Mutations
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: ProductCreateInput,
    @Context() context: AuthContext
  ): Promise<Product> {
    // Validate store ownership
    const store = await this.storeService.getStoreById(input.storeId);
    if (!store || store.ownerId !== context.req.user.id) {
      throw new UnauthorizedException(
        'You do not have permission to create products for this store'
      );
    }

    return this.productService.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Args('input') input: ProductUpdateInput,
    @Context() context: AuthContext
  ): Promise<Product> {
    // Validate product and store ownership
    const product = await this.productService.findById(input.id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${input.id} not found`);
    }

    const store = await this.productService.findProductStore(input.id);
    if (!store || store.ownerId !== context.req.user.id) {
      throw new UnauthorizedException(
        'You do not have permission to update this product'
      );
    }

    return this.productService.update(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Product)
  async deleteProduct(
    @Args('id') id: string,
    @Context() context: AuthContext
  ): Promise<Product> {
    // Validate product and store ownership
    const store = await this.productService.findProductStore(id);
    if (!store || store.ownerId !== context.req.user.id) {
      throw new UnauthorizedException(
        'You do not have permission to delete this product'
      );
    }

    return this.productService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async bulkUpdateProducts(
    @Args('input') input: BulkProductUpdateInput,
    @Context() context: AuthContext
  ): Promise<number> {
    // Validate store ownership
    const store = await this.storeService.getStoreById(input.storeId);
    if (!store || store.ownerId !== context.req.user.id) {
      throw new UnauthorizedException(
        'You do not have permission to update products for this store'
      );
    }

    return this.productService.bulkUpdate(
      input.storeId,
      input.productIds,
      input.data
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async bulkDeleteProducts(
    @Args('input') input: BulkProductDeleteInput,
    @Context() context: AuthContext
  ): Promise<number> {
    // Validate store ownership
    const store = await this.storeService.getStoreById(input.storeId);
    if (!store || store.ownerId !== context.req.user.id) {
      throw new UnauthorizedException(
        'You do not have permission to delete products from this store'
      );
    }

    return this.productService.bulkDelete(input.storeId, input.productIds);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Product)
  async updateProductOptions(
    @Args('productId') productId: string,
    @Args('options', { type: () => [ProductOptionInput] }) options: ProductOptionInput[],
    @Context() context: AuthContext
  ): Promise<Product> {
    const store = await this.productService.findProductStore(productId);
    if (!store || store.ownerId !== context.req.user.id) {
      throw new UnauthorizedException(
        'You do not have permission to update this product'
      );
    }

    return this.productService.updateProductOptions(productId, options);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Product)
  async updateProductVariants(
    @Args('productId') productId: string,
    @Args('variants', { type: () => [ProductVariantInput] }) variants: ProductVariantInput[],
    @Context() context: AuthContext
  ): Promise<Product> {
    const store = await this.productService.findProductStore(productId);
    if (!store || store.ownerId !== context.req.user.id) {
      throw new UnauthorizedException(
        'You do not have permission to update this product'
      );
    }

    return this.productService.updateProductVariants(productId, variants);
  }

  // Field Resolvers
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
}
