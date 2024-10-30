'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {  KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import {  sortableKeyboardCoordinates } from '@dnd-kit/sortable';
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

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
    move: moveOption,
  } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const {
    fields: variantFields,
  } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const addOptionValues = (optionIndex: number, values: string) => {
    const newValues = values
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');
    const currentValues = form.getValues(`options.${optionIndex}.values`) || [];
    const updatedValues = [...new Set([...currentValues, ...newValues])];
    form.setValue(`options.${optionIndex}.values`, updatedValues);
  };

  const generateVariants = () => {
    const options = form.getValues('options');
    if (options.length === 0) return;

    const generateCombinations = (arrays: string[][]) => {
      return arrays.reduce(
        (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
        [[]] as string[][]
      );
    };

    const optionValues = options.map((option) => option.values || []);
    const combinations = generateCombinations(optionValues);

    const newVariants = combinations.map((combination) => ({
      optionCombination: combination,
      price: form.getValues('price'),
      available: 0,
    }));

    form.setValue('variants', newVariants);
  };

  const toggleOptionCollapse = (index: number) => {
    const currentOptions = form.getValues('options');
    if (currentOptions[index]) {
      currentOptions[index].isCollapsed = !currentOptions[index].isCollapsed;
      form.setValue('options', currentOptions);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = optionFields.findIndex((item) => item.id === active.id);
      const newIndex = optionFields.findIndex((item) => item.id === over?.id);
      moveOption(oldIndex, newIndex);
    }
  };

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
            <VariantsCard
              form={form}
              optionFields={optionFields}
              appendOption={appendOption}
              removeOption={removeOption}
              addOptionValues={addOptionValues}
              generateVariants={generateVariants}
              toggleOptionCollapse={toggleOptionCollapse}
              sensors={sensors}
              onDragEnd={onDragEnd}
            />
            {variantFields.length > 0 && (
              <VariantPricingInventoryCard
                form={form}
                optionFields={optionFields}
                variantFields={variantFields}
              />
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