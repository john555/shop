'use client';

import * as React from 'react';
import { ChevronRight, ChevronDown, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/admin-api';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategorySelectProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  className?: string;
  selectedCategoryId?: string;
}

export function CategorySelect({
  categories,
  onSelect,
  className,
  selectedCategoryId,
}: CategorySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [currentCategories, setCurrentCategories] = React.useState(categories);
  const [breadcrumbs, setBreadcrumbs] = React.useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);
  const [highlightedCategories, setHighlightedCategories] = React.useState<
    Set<string>
  >(new Set());

  React.useEffect(() => {
    setCurrentCategories(categories);
  }, [categories]);

  React.useEffect(() => {
    if (selectedCategoryId) {
      const findCategoryAndParents = (
        cats: Category[],
        parents: Category[] = []
      ): [Category | null, Category[]] => {
        for (const cat of cats) {
          if (cat.id === selectedCategoryId) {
            return [cat, parents];
          }
          if (cat.children) {
            const [found, foundParents] = findCategoryAndParents(cat.children, [
              ...parents,
              cat,
            ]);
            if (found) {
              return [found, foundParents];
            }
          }
        }
        return [null, []];
      };

      const [category, parents] = findCategoryAndParents(categories);
      if (category) {
        setSelectedCategory(category);
        setHighlightedCategories(
          new Set([...parents.map((p) => p.id), category.id])
        );
        setBreadcrumbs(parents);
        setCurrentCategories(
          parents.length > 0
            ? parents[parents.length - 1].children || []
            : categories
        );
      }
    }
  }, [selectedCategoryId, categories]);

  const handleSelect = (category: Category) => {
    if (!category.children || category.children.length === 0) {
      setSelectedCategory(category);
      onSelect(category);
      setOpen(false);
      setHighlightedCategories(
        new Set([...breadcrumbs.map((b) => b.id), category.id])
      );
    } else {
      setCurrentCategories(category.children);
      setBreadcrumbs([...breadcrumbs, category]);
    }
  };

  const handleBack = () => {
    if (breadcrumbs.length > 0) {
      const newBreadcrumbs = [...breadcrumbs];
      newBreadcrumbs.pop();
      setBreadcrumbs(newBreadcrumbs);

      if (newBreadcrumbs.length === 0) {
        setCurrentCategories(categories);
      } else {
        const parentCategory = newBreadcrumbs[newBreadcrumbs.length - 1];
        setCurrentCategories(parentCategory.children || []);
      }
    }
  };

  const renderCategoryList = (categories: Category[]) => {
    return categories.map((category) => (
      <Button
        key={category.id}
        variant="ghost"
        size="sm"
        className={cn(
          'w-full justify-start text-left font-normal text-sm',
          (highlightedCategories.has(category.id) ||
            selectedCategory?.id === category.id) &&
            'bg-accent text-accent-foreground'
        )}
        onClick={() => handleSelect(category)}
      >
        {category.name}
        {category.children && category.children.length > 0 && (
          <ChevronRight className="ml-auto h-4 w-4" />
        )}
      </Button>
    ));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between text-sm', className)}
        >
          {selectedCategory ? selectedCategory.name : 'Select category...'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="flex flex-col">
          {breadcrumbs.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="justify-start pl-2 mb-1 text-sm"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          {breadcrumbs.length > 0 && (
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
              {breadcrumbs[breadcrumbs.length - 1].name}
            </div>
          )}
        </div>
        <ScrollArea className="h-72">
          <div className="p-1">{renderCategoryList(currentCategories)}</div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
