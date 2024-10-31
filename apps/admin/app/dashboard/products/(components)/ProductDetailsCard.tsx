import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Upload, X } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { FormValues } from './types';

interface ProductDetailsCardProps {
  form: UseFormReturn<FormValues>;
}

export function ProductDetailsCard({ form }: ProductDetailsCardProps) {
  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control: form.control,
    name: 'media',
  });

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

  return (
    <Card>
      <CardContent className="pt-6 flex flex-col gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Universal Gaming controller" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                </SelectContent>
              </Select>
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
  );
}