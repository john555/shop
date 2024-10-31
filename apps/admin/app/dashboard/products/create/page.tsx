'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { ProductDetailsCard } from './ProductDetailsCard';
import { PricingCard } from './PricingCard';
import { VariantsCard } from './VariantsCard';
import { VariantPricingInventoryCard } from './VariantPricingInventoryCard';
import { SEOCard } from './SEOCard';
import { StatusCard } from './StatusCard';
import { PublishingCard } from './PublishingCard';
import { ProductOrganizationCard } from './ProductOrganizationCard';
import { FormSchema, FormValues } from './types';

export default function CreateProductPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
      compareAtPrice: 0,
      status: 'draft',
      tags: [],
      collections: [],
      seoTitle: '',
      seoDescription: '',
      slug: '',
      salesChannels: [],
      options: [],
      variants: [],
      media: [],
    },
  });

  const { fields: optionFields, move: moveOption } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const { fields: variantFields } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Create product</h1>
          </div>
          <Button type="submit">Save</Button>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div className="flex flex-col gap-6 md:w-2/3">
            <ProductDetailsCard form={form} />
            <PricingCard form={form} />
            <VariantsCard form={form} />
            {variantFields.length > 0 && (
              <VariantPricingInventoryCard form={form} />
            )}
            <SEOCard form={form} />
          </div>
          <div className="flex flex-col gap-6 md:w-1/3">
            <StatusCard form={form} />
            <PublishingCard form={form} />
            <ProductOrganizationCard form={form} />
          </div>
        </div>
      </form>
    </Form>
  );
}
