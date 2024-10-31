import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { FormValues } from './types';
import { PlusCircle } from 'lucide-react';
import {  KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableOption } from './SortableOption';

interface VariantsCardProps {
  form: UseFormReturn<FormValues>;
}

export function VariantsCard({
  form
}: VariantsCardProps) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
    move: moveOption,
  } = useFieldArray({
    control: form.control,
    name: 'options',
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