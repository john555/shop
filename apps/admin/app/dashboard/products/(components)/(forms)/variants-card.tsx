import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, GripVertical, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import { ProductFormValues } from './product-form';
import { VariantDetails } from './variant-details';
import { Switch } from '@/components/ui/switch';

interface VariantsCardProps {
  form: UseFormReturn<ProductFormValues>;
}

export function VariantsCard({ form }: VariantsCardProps) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
    move: moveOption,
  } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const { fields: variantFields } = useFieldArray({
    control: form.control,
    name: 'variants',
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
      compareAtPrice: form.getValues('compareAtPrice'),
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = optionFields.findIndex((item) => item.id === active.id);
      const newIndex = optionFields.findIndex((item) => item.id === over.id);
      moveOption(oldIndex, newIndex);
    }
  };

  const showVariantDetails =
    ((form.getValues('options').length > 0 &&
      form.getValues('variants')?.length) ||
      0) > 0;

  return (
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
          Add {optionFields.length > 0 ? 'another' : 'an'} option
        </Button>
        {showVariantDetails && (
          <>
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
            <Separator />
            <VariantDetails form={form} variantFields={variantFields} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface SortableOptionProps {
  id: string;
  index: number;
  form: UseFormReturn<ProductFormValues>;
  removeOption: (index: number) => void;
  addOptionValues: (index: number, values: string) => void;
  generateVariants: () => void;
  toggleOptionCollapse: (index: number) => void;
}

function SortableOption({
  id,
  index,
  form,
  removeOption,
  addOptionValues,
  generateVariants,
  toggleOptionCollapse,
}: SortableOptionProps) {
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
          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
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
              <div className="flex items-center justify-between mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  Delete
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleDoneClick}
                >
                  Done
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
