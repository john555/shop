'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Upload,
  X,
  Tag,
  Box,
  ChevronRight,
  ArrowLeft,
  Hash,
  Search,
  Plus,
} from 'lucide-react';
import Image from 'next/image';

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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useStore } from '@/admin/hooks/store';
import { useProduct } from '@/admin/hooks/product/use-product';
import { Category, Product, ProductStatus, SalesChannel } from '@/types/api';
import { useParams, useRouter } from 'next/navigation';
import { DASHBOARD_PAGE_LINK } from '@/common/constants';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

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
});

type ProductFormValues = z.infer<typeof productSchema>;

const collections = [
  { id: '1', value: 'summer', label: 'Summer Collection' },
  { id: '2', value: 'winter', label: 'Winter Collection' },
  { id: '3', value: 'spring', label: 'Spring Collection' },
  { id: '4', value: 'autumn', label: 'Autumn Collection' },
  { id: '5', value: 'holiday', label: 'Holiday Special' },
  { id: '6', value: 'sale', label: 'Sale Items' },
  { id: '7', value: 'new', label: 'New Arrivals' },
  { id: '8', value: 'bestsellers', label: 'Bestsellers' },
];

export function ProductForm() {
  const router = useRouter();
  const { id } = useParams();
  const { store } = useStore();
  const { product, loading, error, createProduct, updateProduct } = useProduct(
    id?.toString()
  );

  const [images, setImages] = useState<string[]>([]);
  const [openCollections, setOpenCollections] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isNewCollectionDialogOpen, setIsNewCollectionDialogOpen] =
    useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: getInitialValues(product),
  });

  function getInitialValues (product: Product): ProductFormValues {
    return {
      title: product?.title ?? undefined,
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
    };
  };

  useEffect(() => {
    if (!product) return;
    form.reset(getInitialValues(product));
  }, [product]);

  const onSubmit = async (data: ProductFormValues) => {
    const slug = generateSlug(data.title);
    if (!store?.id) return;

    if (product) {
      await updateProduct({ ...data });
    } else {
      const createdProduct = await createProduct({
        ...data,
        title: data.title, // Ensure title is always included
        slug,
        storeId: store.id,
        price: data.price || 0,
      });
      router.push(`${DASHBOARD_PAGE_LINK}/products/${createdProduct.id}`);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredCollections = collections.filter((collection) =>
    collection.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNewCollection = () => {
    if (newCollectionName.trim() !== '') {
      const newCollection = {
        id: `${collections.length + 1}`,
        value: generateSlug(newCollectionName),
        label: newCollectionName.trim(),
      };
      collections.push(newCollection);
      form.setValue('collectionIds', [
        ...form.getValues('collectionIds'),
        newCollection.id,
      ]);
      setNewCollectionName('');
      setIsNewCollectionDialogOpen(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {product ? 'Edit' : 'Create New'} Product
          </h2>
          <p className="text-sm text-muted-foreground">
            Add a new product to your store
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
          <Button type="submit" form="create-product-form" disabled={loading}>
            {loading
              ? 'Saving...'
              : (product ? 'Update' : 'Create') + ' Product'}
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {store?.categories.map((category: Category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormLabel>Product Images</FormLabel>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-10">
                      <div className="text-center">
                        <Upload
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                          >
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image}
                            alt={`Uploaded image ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-lg object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                              {store?.currencyPosition === 'BEFORE_AMOUNT' && (
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
                                  store?.currencyPosition === 'BEFORE_AMOUNT'
                                    ? 'pl-16'
                                    : 'pr-16'
                                }
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                              {store?.currencyPosition === 'AFTER_AMOUNT' && (
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  {store?.showCurrencyCode
                                    ? store?.currency
                                    : store?.currencySymbol}
                                </span>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Set the selling price for your product. Enter 0 for
                            free items.
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
                              {store?.currencyPosition === 'BEFORE_AMOUNT' && (
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
                                  store?.currencyPosition === 'BEFORE_AMOUNT'
                                    ? 'pl-16'
                                    : 'pr-16'
                                }
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                              {store?.currencyPosition === 'AFTER_AMOUNT' && (
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
                            <SelectItem value="DRAFT">
                              <Badge variant="secondary">Draft</Badge>
                            </SelectItem>
                            <SelectItem value="ACTIVE">
                              <Badge className="bg-green-500 hover:bg-green-600">
                                Active
                              </Badge>
                            </SelectItem>
                            <SelectItem value="ARCHIVED">
                              <Badge variant="destructive">Archived</Badge>
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
                              <input
                                type="checkbox"
                                checked={field.value.includes(
                                  SalesChannel.Online
                                )}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, SalesChannel.Online]
                                    : field.value.filter(
                                        (v) => v !== SalesChannel.Online
                                      );
                                  field.onChange(newValue);
                                }}
                                className="form-checkbox h-5 w-5 text-primary"
                              />
                              <span>Online</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={field.value.includes(
                                  SalesChannel.InStore
                                )}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, SalesChannel.InStore]
                                    : field.value.filter(
                                        (v) => v !== SalesChannel.InStore
                                      );
                                  field.onChange(newValue);
                                }}
                                className="form-checkbox h-5 w-5 text-primary"
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
                                <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <div className="p-2">
                                <div className="relative">
                                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Search collections..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) =>
                                      setSearchQuery(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <ScrollArea className="h-[300px]">
                                {filteredCollections.map((collection) => (
                                  <div
                                    key={collection.id}
                                    className="flex items-center space-x-2 p-2 cursor-pointer"
                                    onClick={() => {
                                      const newValue = field.value.includes(
                                        collection.id
                                      )
                                        ? field.value.filter(
                                            (value) => value !== collection.id
                                          )
                                        : [...field.value, collection.id];
                                      field.onChange(newValue);
                                    }}
                                  >
                                    <Checkbox
                                      checked={field.value.includes(
                                        collection.id
                                      )}
                                      onCheckedChange={() => {
                                        /**/
                                      }}
                                    />
                                    <label>{collection.label}</label>
                                  </div>
                                ))}
                                {filteredCollections.length === 0 && (
                                  <div className="p-2 text-center text-sm text-muted-foreground">
                                    No collections found
                                  </div>
                                )}
                              </ScrollArea>
                              <Separator />
                              <div className="p-2">
                                <Dialog
                                  open={isNewCollectionDialogOpen}
                                  onOpenChange={setIsNewCollectionDialogOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Create New Collection
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Create New Collection
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="name"
                                          className="text-right"
                                        >
                                          Name
                                        </Label>
                                        <Input
                                          id="name"
                                          value={
                                            newCollectionName || searchQuery
                                          }
                                          onChange={(e) =>
                                            setNewCollectionName(e.target.value)
                                          }
                                          className="col-span-3"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        type="submit"
                                        onClick={handleCreateNewCollection}
                                      >
                                        Create Collection
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
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
                                {collection ? collection.label : collectionId}
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
