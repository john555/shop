'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tag, Box, ArrowLeft, Hash, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/admin/hooks/store';
import { useProduct } from '@/admin/hooks/product/use-product';
import {
  MediaOwnerType,
  Product,
  ProductStatus,
  SalesChannel,
} from '@/types/admin-api';
import { useParams, useRouter } from 'next/navigation';
import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useCollections } from '@/admin/hooks/collection';
import MediaInput from '@/components/media-input';
import { ProductStatusBadge } from '../(ui)/product-status-badge';
import { VariantsCard } from './variants-card';
import { CategorySelect } from '@/components/category-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const variantSchema = z.object({
  id: z.string().optional(),
  optionCombination: z.array(z.string()),
  price: z.number().nonnegative('Price must be non-negative'),
  compareAtPrice: z
    .number()
    .nonnegative('Compare at price must be positive')
    .optional()
    .nullable(),
  sku: z.string().optional().nullable(),
  available: z
    .number()
    .int()
    .nonnegative('Available quantity must be non-negative')
    .optional(),
});

const productSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price must be non-negative'),
  compareAtPrice: z
    .number()
    .nonnegative('Compare at price must be positive')
    .optional(),
  sku: z.string().optional(),
  available: z
    .number()
    .int()
    .nonnegative('Available quantity must be non-negative')
    .optional(),
  categoryId: z.string().optional(),
  collectionIds: z.array(z.string()),
  salesChannels: z
    .array(z.nativeEnum(SalesChannel))
    .default([SalesChannel.Online]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.Active),
  tagIds: z.array(z.string()),
  trackInventory: z.boolean().default(false),
  options: z
    .array(
      z.object({
        name: z.string().min(1, 'Option name is required'),
        values: z.array(z.string().min(1, 'Option value is required')),
        isCollapsed: z.boolean().optional().default(false),
      })
    )
    .optional()
    .default([]),
  variants: z.array(variantSchema).optional(),
  mediaIds: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm() {
  const router = useRouter();
  const { id } = useParams();
  const { store } = useStore();
  const {
    product,
    loading,
    updating,
    creating,
    error,
    createProduct,
    updateProduct,
  } = useProduct(id?.toString());
  const { collections } = useCollections({ storeId: store?.id });
  const [openCollections, setOpenCollections] = useState(false);
  const isEditMode = !!id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: getInitialValues(product),
  });

  const { isDirty, isValid } = form.formState;
  const selectedCollections: string[] = form.watch('collectionIds');

  const haveCollectionsChanged = (
    currentCollections: string[],
    initialCollections: string[] = []
  ) => {
    if (currentCollections.length !== initialCollections.length) return true;
    return currentCollections.some((id) => !initialCollections.includes(id));
  };

  function getInitialValues(product?: Product): ProductFormValues {
    return {
      title: product?.title ?? '',
      description: product?.description ?? undefined,
      price: product?.price || 0,
      compareAtPrice: product?.compareAtPrice ?? undefined,
      sku: product?.sku ?? undefined,
      available: product?.available ?? undefined,
      salesChannels: product?.salesChannels || [SalesChannel.Online],
      status: product?.status || ProductStatus.Active,
      trackInventory: product?.trackInventory || false,
      collectionIds: product?.collections?.map((c) => c.id) || [],
      tagIds: product?.tags?.map((t) => t.id) || [],
      categoryId: product?.category?.id,
      seoTitle: product?.seoTitle ?? undefined,
      seoDescription: product?.seoDescription ?? undefined,
      options:
        product?.options?.map((o) => ({ ...o, isCollapsed: true })) || [],
      variants: product?.variants ?? [],
      mediaIds: product?.media?.map((m) => m.id) || [],
    };
  }

  useEffect(() => {
    if (!product) return;
    form.reset(getInitialValues(product));
  }, [product, form]);

  const onSubmit = async (data: ProductFormValues) => {
    const slug = generateSlug(data.title);
    if (!store?.id) return;

    if (product) {
      const updatedProduct = await updateProduct({
        ...data,
        options: data?.options?.map((o) => ({
          name: o.name,
          values: o.values,
        })),
      });
      form.reset(getInitialValues(updatedProduct));
    } else {
      const createdProduct = await createProduct({
        ...data,
        title: data.title,
        slug,
        storeId: store.id,
        price: data.price || 0,
        options: data?.options?.map((o) => ({
          name: o.name,
          values: o.values,
        })),
      });
      router.push(`${DASHBOARD_PAGE_LINK}/products/${createdProduct.id}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const isSubmitDisabled =
    updating ||
    creating ||
    (isEditMode
      ? !isValid ||
        (!isDirty &&
          !haveCollectionsChanged(
            selectedCollections,
            product?.collections?.map((c) => c.id)
          ))
      : !isValid);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? 'Update the details of your product'
              : 'Add a new product to your store'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`${DASHBOARD_PAGE_LINK}/products`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <Button
            type="submit"
            form="create-product-form"
            className="min-w-[136px]"
            disabled={isSubmitDisabled}
          >
            {updating || creating
              ? 'Saving...'
              : isEditMode
              ? 'Update product'
              : 'Create product'}
          </Button>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form
          id="create-product-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Wireless Noise-Cancelling Headphones"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a clear and concise title for your product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your product's features, benefits, and any other relevant details..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of your product to
                          inform potential customers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <CategorySelect
                          categories={store?.categories || []}
                          onSelect={(category) => field.onChange(category.id)}
                          selectedCategoryId={field.value}
                          className="w-full"
                        />
                        <FormDescription>
                          Select a category for your product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormLabel>Product Images</FormLabel>
                    <MediaInput
                      ownerId={product?.id}
                      ownerType={
                        product?.id ? MediaOwnerType.Product : undefined
                      }
                      storeId={store?.id}
                      selectedMediaIds={form.watch('mediaIds') || []}
                      onChange={(mediaIds: string[]) =>
                        form.setValue('mediaIds', mediaIds, {
                          shouldDirty: true,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              <Tabs defaultValue="single">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Single product</TabsTrigger>
                  <TabsTrigger value="variants">Variants e.g Size, Color, etc</TabsTrigger>
                </TabsList>
                <TabsContent value="single">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pricing & Inventory</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  {store?.currencyPosition ===
                                    'BEFORE_AMOUNT' && (
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                      {store?.showCurrencyCode
                                        ? store?.currency
                                        : store?.currencySymbol}
                                    </span>
                                  )}
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={
                                      store?.currencyPosition ===
                                      'BEFORE_AMOUNT'
                                        ? 'pl-16'
                                        : 'pr-16'
                                    }
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                  {store?.currencyPosition ===
                                    'AFTER_AMOUNT' && (
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                      {store?.showCurrencyCode
                                        ? store?.currency
                                        : store?.currencySymbol}
                                    </span>
                                  )}
                                </div>
                              </FormControl>
                              <FormDescription>
                                Set the selling price for your product. Enter 0
                                for free items.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="compareAtPrice"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Compare at Price</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  {store?.currencyPosition ===
                                    'BEFORE_AMOUNT' && (
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                      {store?.showCurrencyCode
                                        ? store?.currency
                                        : store?.currencySymbol}
                                    </span>
                                  )}
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={
                                      store?.currencyPosition ===
                                      'BEFORE_AMOUNT'
                                        ? 'pl-16'
                                        : 'pr-16'
                                    }
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                  {store?.currencyPosition ===
                                    'AFTER_AMOUNT' && (
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                      {store?.showCurrencyCode
                                        ? store?.currency
                                        : store?.currencySymbol}
                                    </span>
                                  )}
                                </div>
                              </FormControl>
                              <FormDescription>
                                Optional. Use to show a discounted price by
                                displaying the original price.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="trackInventory"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Track Inventory
                              </FormLabel>
                              <FormDescription>
                                Enable inventory tracking for this product
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {form.watch('trackInventory') && (
                        <div className="flex space-x-4">
                          <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <Input
                                      placeholder="e.g. WH-1000XM4"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Enter a unique identifier for your product.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="available"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Available Quantity</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="pl-10"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(parseInt(e.target.value))
                                      }
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Enter the number of items available in stock.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="variants">
                  <VariantsCard form={form} />
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Buy Wireless Headphones | Your Store Name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a title that will appear in search engine
                          results. Aim for 50-60 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Discover our high-quality wireless headphones with noise-cancelling technology. Perfect for music lovers and professionals alike."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Write a brief summary of the product for search
                          engines. Aim for 150-160 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ProductStatus.Draft}>
                              <ProductStatusBadge
                                status={ProductStatus.Draft}
                              />
                            </SelectItem>
                            <SelectItem value={ProductStatus.Active}>
                              <ProductStatusBadge
                                status={ProductStatus.Active}
                              />
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salesChannels"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Channels</FormLabel>
                        <FormControl>
                          <div className="flex gap-4">
                            <label className="flex items-center space-x-2">
                              <Switch
                                checked={field.value.includes(
                                  SalesChannel.Online
                                )}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, SalesChannel.Online]
                                    : field.value.filter(
                                        (v) => v !== SalesChannel.Online
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                              <span>Online</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <Switch
                                checked={field.value.includes(
                                  SalesChannel.InStore
                                )}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, SalesChannel.InStore]
                                    : field.value.filter(
                                        (v) => v !== SalesChannel.InStore
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                              <span>In Store</span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="collectionIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collections</FormLabel>
                        <FormControl>
                          <Popover
                            open={openCollections}
                            onOpenChange={setOpenCollections}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCollections}
                                className="w-full justify-between"
                              >
                                {field.value.length > 0
                                  ? `${field.value.length} collection${
                                      field.value.length > 1 ? 's' : ''
                                    } selected`
                                  : 'Select collections'}
                                <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <Command>
                                <CommandInput placeholder="Search collections..." />
                                <CommandList>
                                  <CommandEmpty>No product found.</CommandEmpty>
                                  <CommandGroup>
                                    {collections.map((collection) => (
                                      <CommandItem
                                        key={collection.id}
                                        onSelect={() => {
                                          const newValue = field.value.includes(
                                            collection.id
                                          )
                                            ? field.value.filter(
                                                (value) =>
                                                  value !== collection.id
                                              )
                                            : [...field.value, collection.id];
                                          field.onChange(newValue);
                                        }}
                                      >
                                        <div className="flex items-center justify-between w-full">
                                          {collection.name}
                                          <Checkbox
                                            checked={field.value.includes(
                                              collection.id
                                            )}
                                          />
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {field.value.map((collectionId) => {
                            const collection = collections.find(
                              (c) => c.id === collectionId
                            );
                            return (
                              <Badge
                                key={collectionId}
                                variant="secondary"
                                className="text-xs"
                              >
                                {collection ? collection.name : collectionId}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-1 h-auto p-0 text-xs"
                                  onClick={() => {
                                    const newValue = field.value.filter(
                                      (id) => id !== collectionId
                                    );
                                    field.onChange(newValue);
                                  }}
                                >
                                  ×
                                </Button>
                              </Badge>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tagIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <div className="relative flex-1">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input
                              placeholder="Enter a tag and press Enter"
                              className="pl-10"
                              onKeyDown={(e) => {
                                if (
                                  e.key === 'Enter' &&
                                  e.currentTarget.value
                                ) {
                                  e.preventDefault();
                                  field.onChange([
                                    ...field.value,
                                    e.currentTarget.value,
                                  ]);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Add relevant tags to improve product discoverability.
                          Press Enter after each tag.
                        </FormDescription>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {field.value.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-auto p-0 text-xs"
                                onClick={() => {
                                  const newValue = field.value.filter(
                                    (_, i) => i !== index
                                  );
                                  field.onChange(newValue);
                                }}
                              >
                                ×
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
