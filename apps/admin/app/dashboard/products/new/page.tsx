'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, GripVertical, PlusCircle, X, Upload } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const FormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string(),
  category: z.string(),
  price: z.number().min(0, { message: 'Price must be a positive number' }),
  compareAtPrice: z
    .number()
    .min(0, { message: 'Compare-at price must be a positive number' })
    .optional(),
  status: z.enum(['active', 'draft']),
  tags: z.array(z.string()),
  collections: z.array(z.string()),
  seoTitle: z.string(),
  seoDescription: z.string(),
  slug: z.string().optional(),
  salesChannels: z.array(z.string()),
  options: z.array(
    z.object({
      name: z.string().min(1, { message: 'Option name is required.' }),
      values: z.array(z.string()),
      isCollapsed: z.boolean(),
    })
  ),
  variants: z.array(
    z.object({
      optionCombination: z.array(z.string()),
      price: z.number().min(0),
      available: z.number().int().min(0),
    })
  ),
  media: z.array(
    z.object({
      type: z.enum(['image', 'video', '3d']),
      url: z.string(),
    })
  ),
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
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const {
    fields: mediaFields,
    append: appendMedia,
    remove: removeMedia,
  } = useFieldArray({
    control: form.control,
    name: 'media',
  });

  const addOptionValues = (optionIndex: number, values: string) => {
    const newValues = values
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');
    const currentValues = form.getValues(`options.${optionIndex}.values`);
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

    const optionValues = options.map((option) => option.values);
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
    currentOptions[index].isCollapsed = !currentOptions[index].isCollapsed;
    form.setValue('options', currentOptions);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = optionFields.findIndex((item) => item.id === active.id);
      const newIndex = optionFields.findIndex((item) => item.id === over.id);
      moveOption(oldIndex, newIndex);
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const type = file.type.startsWith('image')
          ? 'image'
          : file.type.startsWith('video')
          ? 'video'
          : '3d';
        appendMedia({ type, url });
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
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
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl text-slate-500">Create product</h3>
          </div>
          <Link href="/dashboard/products/new">
            <Button type="submit">Save</Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div className="flex flex-col gap-6 md:w-2/3">
            {/* Title, Description, Category, and Media Card */}
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
                          placeholder="Universal Gaming controller"
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

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">
                              Electronics
                            </SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Media</FormLabel>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {mediaFields.map((field, index) => (
                      <div key={field.id} className="relative">
                        {field.type === 'image' && (
                          <img
                            src={field.url}
                            alt={`Product media ${index + 1}`}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        {field.type === 'video' && (
                          <video
                            src={field.url}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        {field.type === '3d' && (
                          <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                            3D Model
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 bg-white rounded-full p-1"
                          onClick={() => removeMedia(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleMediaUpload}
                        accept="image/*,video/*,.glb,.gltf"
                      />
                      <Upload className="h-8 w-8 text-gray-400" />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
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
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
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
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Variants Card */}
            <Card>
              <CardHeader>
                <CardTitle>Variants</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext
                    items={optionFields.map((field) => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {optionFields.map((field, index) => (
                      <SortableOption
                        key={field.id}
                        id={field.id}
                        index={index}
                        form={form}
                        removeOption={removeOption}
                        addOptionValues={addOptionValues}
                        generateVariants={generateVariants}
                        toggleOptionCollapse={toggleOptionCollapse}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendOption({ name: '', values: [], isCollapsed: false })
                  }
                  className="w-full"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add another option
                </Button>
              </CardContent>
            </Card>

            {/* Variant Table */}
            <Card>
              <CardHeader>
                <CardTitle>Variant Pricing and Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      {optionFields.map((option, index) => (
                        <TableHead key={index}>
                          {form.watch(`options.${index}.name`)}
                        </TableHead>
                      ))}
                      <TableHead>Price</TableHead>
                      <TableHead>Available</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variantFields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        {optionFields.map((option, optionIndex) => (
                          <TableCell key={optionIndex}>
                            {form.watch(
                              `variants.${index}.optionCombination.${optionIndex}`
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`variants.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`variants.${index}.available`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value))
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* SEO Card */}
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL handle</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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
                          onValueChange={(value) =>
                            field.onChange([...field.value, value])
                          }
                          value={field.value[field.value.length - 1]}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online-store">
                              Online store
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
                <CardTitle>Product organization</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange([...field.value, value])
                          }
                          value={field.value[field.value.length - 1]}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tag1">Tag1</SelectItem>
                            <SelectItem value="tag2">Tag2</SelectItem>
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
                        <Select
                          onValueChange={(value) =>
                            field.onChange([...field.value, value])
                          }
                          value={field.value[field.value.length - 1]}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="collection1">
                              Collection1
                            </SelectItem>
                            <SelectItem value="collection2">
                              Collection2
                            </SelectItem>
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
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </Form>
  );
}

function SortableOption({
  id,
  index,
  form,
  removeOption,
  addOptionValues,
  generateVariants,
  toggleOptionCollapse,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [inputValue, setInputValue] = React.useState('');

  const handleDoneClick = () => {
    if (inputValue.trim()) {
      addOptionValues(index, inputValue);
      setInputValue('');
    }
    generateVariants();
    toggleOptionCollapse(index);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-4 ${
        isDragging ? 'opacity-50 bg-secondary rounded-lg shadow-lg' : ''
      }`}
    >
      {index > 0 && <Separator className="mb-4" />}
      <div className="flex flex-col gap-4">
        {form.getValues('options')[index]?.isCollapsed ? (
          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5 text-gray-500" />
            </div>
            <div
              className="flex-grow cursor-pointer"
              onClick={() => toggleOptionCollapse(index)}
            >
              <h4 className="font-medium mb-2">
                {form.getValues(`options.${index}.name`)}
              </h4>
              <div className="flex flex-wrap gap-2">
                {form
                  .watch(`options.${index}.values`)
                  .map((value, valueIndex) => (
                    <div
                      key={valueIndex}
                      className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                    >
                      {value}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 w-full">
                <div
                  {...attributes}
                  {...listeners}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-grow">
                  <FormField
                    control={form.control}
                    name={`options.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Option name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Size, Color, Material"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(index)}
                className="self-start mt-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="ml-7">
              <FormLabel>Option values</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {form
                  .watch(`options.${index}.values`)
                  .map((value, valueIndex) => (
                    <div
                      key={valueIndex}
                      className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                    >
                      {value}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-auto p-0"
                        onClick={() => {
                          const currentValues = form.getValues(
                            `options.${index}.values`
                          );
                          form.setValue(
                            `options.${index}.values`,
                            currentValues.filter((_, i) => i !== valueIndex)
                          );
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
              </div>
              <div className="flex items-center mt-2">
                <Input
                  placeholder="Add option values, separated by comma"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (inputValue.trim()) {
                        addOptionValues(index, inputValue);
                        setInputValue('');
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    if (inputValue.trim()) {
                      addOptionValues(index, inputValue);
                      setInputValue('');
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="ml-7"
              onClick={handleDoneClick}
            >
              Done
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
