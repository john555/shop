import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { FormValues } from './types';

interface SortableOptionProps {
  id: string;
  index: number;
  form: UseFormReturn<FormValues>;
  removeOption: (index: number) => void;
  addOptionValues: (index: number, values: string) => void;
  toggleOptionCollapse: (index: number) => void;
}

const generateVariants = (form: UseFormReturn<FormValues>) => {
  const options = form.getValues('options');
  if (options.length === 0) {
    form.setValue('variants', []);
    return;
  }

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

export function SortableOption({
  id,
  index,
  form,
  removeOption,
  addOptionValues,
  toggleOptionCollapse,
}: SortableOptionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [inputValue, setInputValue] = useState('');

  const handleDoneClick = () => {
    if (inputValue.trim()) {
      addOptionValues(index, inputValue);
      setInputValue('');
    }
    generateVariants(form);
    toggleOptionCollapse(index);
  };

  const handleRemoveClick = () => {
    removeOption(index);
    generateVariants(form);
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
          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
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
                  .map((value: string, valueIndex: number) => (
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
                onClick={handleRemoveClick}
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
                  .map((value: string, valueIndex: number) => (
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