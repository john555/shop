'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Upload, X, DollarSign, Tag, Box, ChevronRight, ArrowLeft, Bold, Italic, List } from 'lucide-react'
import Image from 'next/image'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const productSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive('Compare at price must be positive').optional(),
  sku: z.string().optional(),
  slug: z.string(),
  available: z.number().int().nonnegative('Available quantity must be non-negative').optional(),
  categoryId: z.string().optional(),
  collectionIds: z.array(z.string()).optional(),
  salesChannels: z.array(z.enum(['ONLINE', 'IN_STORE'])),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  storeId: z.string(),
  tagIds: z.array(z.string()).optional(),
  trackInventory: z.boolean().default(false),
})

type ProductFormValues = z.infer<typeof productSchema>

const RichTextEditor = ({ content, onChange }: { content: string; onChange: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-md p-2">
      <div className="flex items-center gap-2 mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="prose dark:prose-invert max-w-none" />
    </div>
  )
}

export function CreateProductFormComponent() {
  const [images, setImages] = useState<string[]>([])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      slug: '',
      salesChannels: ['ONLINE'],
      status: 'DRAFT',
      storeId: '', // This should be set dynamically based on the current store
      trackInventory: false,
    },
  })

  const onSubmit = (data: ProductFormValues) => {
    console.log(data)
    // Here you would typically send the data to your API
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Create New Product</h2>
          <p className="text-sm text-muted-foreground">
            Add a new product to your store
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <Button type="submit" form="create-product-form">
            Create Product
          </Button>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form id="create-product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          <Input placeholder="e.g. Wireless Noise-Cancelling Headphones" {...field} />
                        </FormControl>
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
                          <RichTextEditor content={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="wireless-noise-cancelling-headphones" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
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
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-10">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                        >
                          <span>Upload files</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageUpload} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image src={image} alt={`Uploaded image ${index + 1}`} width={100} height={100} className="rounded-lg object-cover w-full h-full" />
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
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input type="number" step="0.01" className="pl-8" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="compareAtPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compare at Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input type="number" step="0.01" className="pl-8" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input className="pl-8" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="available"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Quantity</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input type="number" className="pl-8" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trackInventory"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Track Inventory</FormLabel>
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
                          <Input {...field} />
                        </FormControl>
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
                          <Input {...field} />
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
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="category1">Electronics</SelectItem>
                            <SelectItem value="category2">Clothing</SelectItem>
                            <SelectItem value="category3">Home &amp; Garden</SelectItem>
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
                                checked={field.value.includes('ONLINE')}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, 'ONLINE']
                                    : field.value.filter(v => v !== 'ONLINE')
                                  field.onChange(newValue)
                                }}
                                className="form-checkbox h-5 w-5 text-primary"
                              />
                              <span>Online</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={field.value.includes('IN_STORE')}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, 'IN_STORE']
                                    : field.value.filter(v => v !== 'IN_STORE')
                                  field.onChange(newValue)
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
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}