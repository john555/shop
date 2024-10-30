import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { FormValues } from './types';
import { PlusCircle } from 'lucide-react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableOption } from './SortableOption';

interface VariantsCardProps {
  form: UseFormReturn<FormValues>;
  optionFields: UseFieldArrayReturn['fields'];
  appendOption: UseFieldArrayReturn['append'];
  removeOption: UseFieldArrayReturn['remove'];
  addOptionValues: (index: number, values: string) => void;
  generateVariants: () => void;
  toggleOptionCollapse: (index: number) => void;
  sensors: any;
  onDragEnd: (event: DragEndEvent) => void;
}

export function VariantsCard({
  form,
  optionFields,
  appendOption,
  removeOption,
  addOptionValues,
  generateVariants,
  toggleOptionCollapse,
  sensors,
  onDragEnd,
}: VariantsCardProps) {
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
          Add another option
        </Button>
      </CardContent>
    </Card>
  );
}