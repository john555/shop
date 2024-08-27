'use client';

import { Button } from '@libs/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@libs/components/ui/card';
import Link from 'next/link';
import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@libs/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@libs/components/ui/select';
import { Input } from '@libs/components/ui/input';
import { Textarea } from '@libs/components/ui/textarea';

const FormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title be at least 2 characters.',
  }),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  compareAtPrice: z.number(),
  status: z.string(),
  tags: z.string(),
  collections: z.string(),
});

export default function CreateProductPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
      compareAtPrice: 0,
      status: 'draft',
      tags: '', // TODO convert to array
      collections: '', // TODO convert to array
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log({
      data,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="container mx-auto">
          <div className="flex flex-row justify-between items-center pb-4">
            <h3 className="text-xl text-slate-500">Create a new Product</h3>
            <Link href="/dashboard/products/new">
              <Button type="submit">Save</Button>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            <div className="flex flex-col gap-6 md:w-2/3">
              <Card>
                <CardContent className="pt-6 flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Gaming controller" {...field} />
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
                          <Textarea className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select {...field}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Electronics</SelectLabel>
                                <SelectItem value="apple">Phones</SelectItem>
                                <SelectItem value="apple">Computers</SelectItem>
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel>Kitchen</SelectLabel>
                                <SelectItem value="apple">Cookers</SelectItem>
                                <SelectItem value="apple">Fridges</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                            />
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
                          <FormLabel>Compare-at price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col gap-4"></CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Variants</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col gap-4"></CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                  <CardDescription>
                    Add a title and description to see how this product might
                    appear in a search engine listing
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col gap-4"></CardContent>
              </Card>
            </div>
            <div className="flex flex-col gap-6 md:w-1/3">
              <Card>
                <CardContent className="pt-6 flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select {...field}>
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product organization</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Select {...field}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Tag1 </SelectItem>
                              <SelectItem value="draft">Tag2</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collections"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collections</FormLabel>
                        <FormControl>
                          <Select {...field}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Collection1</SelectItem>
                              <SelectItem value="draft">Collection2</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
