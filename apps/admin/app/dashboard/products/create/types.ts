import { z } from 'zod';

export const FormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
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

export type FormValues = z.infer<typeof FormSchema>;