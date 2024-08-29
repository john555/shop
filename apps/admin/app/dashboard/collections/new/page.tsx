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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@libs/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@libs/components/ui/select';
import { Input } from '@libs/components/ui/input';
import { Textarea } from '@libs/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@libs/components/ui/radio-group';
import { Label } from '@libs/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const FormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title be at least 2 characters.',
  }),
  description: z.string(),
  type: z.string(),
  collectionType: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  seoSlug: z.string().optional(),
  salesChannels: z.string().optional(),
  image: z.string().optional(),
});

export default function CreateCollectionPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: undefined,
      description: undefined,
      collectionType: undefined,
      seoTitle: undefined,
      seoDescription: undefined,
      seoSlug: undefined,
      image: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log({
      data,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container mx-auto space-y-6"
      >
        <div className="flex flex-row justify-between items-center pb-4">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" className="p-2">
              <ArrowLeft />
            </Button>
            <h3 className="text-xl text-slate-500">Create collection</h3>
          </div>
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
                        <Input
                          placeholder="e.g Black Friday sale, Staff picks"
                          {...field}
                        />
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Type</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="collectionType"
                  render={({ field }) => (
                    <RadioGroup
                      defaultValue="manual"
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem
                          value="manual"
                          id="r1"
                          className="shrink-0"
                        />
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="r1">Manual</Label>
                          <div className="text-sm text-muted-foreground">
                            Add products to this collection one by one.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem
                          value="automated"
                          id="r2"
                          className="shrink-0"
                        />
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="r2">Automated</Label>
                          <div className="text-sm text-muted-foreground">
                            Existing and future products that match the
                            conditions you set will automatically be added to
                            this collection.
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />
              </CardContent>
            </Card>

            {/* Display if collection type is `manual` */}
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4"></CardContent>
            </Card>
            {/* Display if collection type is `automated` */}
            <Card>
              <CardHeader>
                <CardTitle>Conditions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4"></CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>
                  Add a title and description to see how this product might
                  appear in a search engine listing
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page title</FormLabel>
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
                      <FormLabel>Meta description</FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seoSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL handle</FormLabel>

                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        span.text-muted-foreground.text
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-6 md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="salesChannels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales channels</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online-store">
                              Online store{' '}
                            </SelectItem>
                            <SelectItem value="pos">POS</SelectItem>
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
                <CardTitle>Image</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <>
                      <Input type="hidden" {...field} />
                      <div className="flex flex-col items-center justify-center gap-4 border border-dashed rounded-md p-4 cursor-pointer">
                        <Button type="button" variant="outline">
                          Add image
                        </Button>
                        <div className="text-sm text-muted-foreground">
                          or drop an image to upload
                        </div>
                      </div>
                    </>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
