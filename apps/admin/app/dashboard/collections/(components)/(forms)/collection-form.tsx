'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, ArrowLeft, Plus } from 'lucide-react';
import Image from 'next/image';
import { slugify } from '@/common/slugify';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { useCollection } from '@/admin/hooks/collection';
import { useProducts } from '@/admin/hooks/product';
import { useStore } from '@/admin/hooks/store';
import { useParams, useRouter } from 'next/navigation';
import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import { Collection } from '@/types/api';

const collectionSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be 50 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  isActive: z.boolean().default(true),
  seoTitle: z
    .string()
    .max(60, 'SEO Title must be 60 characters or less')
    .optional(),
  seoDescription: z
    .string()
    .max(160, 'SEO Description must be 160 characters or less')
    .optional(),
  productIds: z.array(z.string()).optional().default([]),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

export function CollectionForm() {
  const router = useRouter();
  const { id } = useParams();
  const {
    collection,
    loading,
    updating,
    creating,
    error,
    createCollection,
    updateCollection,
  } = useCollection(id?.toString());
  const { store } = useStore();
  const { products } = useProducts({ storeId: store?.id });
  const [image, setImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isEditMode = !!id;

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: getInitialValues(collection),
  });
  const productIds = form.watch('productIds');
  const selectedProducts = products?.filter((product) =>
    productIds.includes(product.id)
  );
  const { isDirty, isValid } = form.formState;

  const haveProductIdsChanged = useCallback(() => {
    if (!collection?.products) return false;

    if (collection.products.length !== productIds.length) return true;

    return productIds.some((pid) =>
      collection.products.every((p) => p.id !== pid)
    );
  }, [collection, productIds, isEditMode]);

  function getInitialValues(collection?: Collection): CollectionFormValues {
    return {
      name: collection?.name ?? '',
      description: collection?.description ?? '',
      isActive: collection?.isActive ?? true,
      seoTitle: collection?.seoTitle ?? '',
      seoDescription: collection?.seoDescription ?? '',
      productIds: collection?.products?.map((product) => product.id) ?? [],
    };
  }

  useEffect(() => {
    if (!collection) return;
    form.reset(getInitialValues(collection));
  }, [collection]);

  const onSubmit = async (data: CollectionFormValues) => {
    if (!store) return;

    if (isEditMode) {
      const updatedProduct = await updateCollection(data);
      form.reset(getInitialValues(updatedProduct));
    } else {
      const createdCollection = await createCollection({
        ...data,
        name: data.name,
        slug: slugify(data.name),
        storeId: store.id,
      });

      router.push(`${DASHBOARD_PAGE_LINK}/collections/${createdCollection.id}`);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const toggleProduct = (productId: string) => {
    form.setValue(
      'productIds',
      productIds.some((p) => p === productId)
        ? productIds.filter((p) => p !== productId)
        : [...productIds, productId],
      { shouldDirty: true }
    );
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
      ? !isValid || (!isDirty && !haveProductIdsChanged())
      : !isValid);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {isEditMode ? 'Edit Collection' : 'Create New Collection'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? 'Update your collection details'
              : 'Add a new collection to group your products'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`${DASHBOARD_PAGE_LINK}/collections`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Button>
          <Button
            type="submit"
            form="collection-form"
            disabled={isSubmitDisabled}
            className="min-w-[152px]"
          >
            {updating || creating
              ? 'Saving...'
              : isEditMode
              ? 'Update Collection'
              : 'Create Collection'}
          </Button>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form
          id="collection-form"
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Summer Collection"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a name for your collection.
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
                            placeholder="Describe your collection..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a brief description of your collection.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormLabel>Collection Image</FormLabel>
                    <div className="mt-2">
                      {image ? (
                        <div className="relative">
                          <Image
                            src={image}
                            alt="Collection image"
                            width={300}
                            height={300}
                            className="rounded-lg object-cover w-full h-[200px]"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-10">
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
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
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
                      )}
                    </div>
                  </div>
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
                            placeholder="e.g. Summer Collection | Your Store Name"
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
                            placeholder="Discover our latest summer collection featuring trendy and comfortable styles for the season."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Write a brief summary of the collection for search
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
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active Status
                          </FormLabel>
                          <FormDescription>
                            Activate or deactivate this collection
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
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 mb-4">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {productIds.length > 0
                            ? `${productIds.length} product${
                                productIds.length > 1 ? 's' : ''
                              } selected`
                            : 'Select products'}
                          <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search products..." />
                          <CommandList>
                            <CommandEmpty>No product found.</CommandEmpty>
                            <CommandGroup>
                              {products.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  onSelect={() => toggleProduct(product.id)}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    {product.title}
                                    <Checkbox
                                      checked={productIds.some(
                                        (pid) => pid === product.id
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
                    <div className="text-right">
                      <Link
                        href={`${DASHBOARD_PAGE_LINK}/products/create`}
                        className="text-sm text-muted-foreground hover:text-foreground relative group"
                      >
                        Create a new product
                        <span className="absolute left-0 right-0 bottom-0 h-px bg-current transform scale-x-0 transition-transform group-hover:scale-x-100 mt-1"></span>
                      </Link>
                    </div>
                  </div>
                  {productIds.length > 0 && (
                    <div className="border rounded-md">
                      <ScrollArea className="h-[200px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedProducts.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>{product.title}</TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>
                                  ${product?.price?.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleProduct(product.id)}
                                  >
                                    Remove
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <Button
            type="submit"
            form="collection-form"
            disabled={isSubmitDisabled}
            className="min-w-[152px]"
          >
            {updating || creating
              ? 'Saving...'
              : isEditMode
              ? 'Update Collection'
              : 'Create Collection'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
