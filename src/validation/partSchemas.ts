import { z } from 'zod';

const partSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(1),
  condition: z.string().min(1),
  stock: z.string().min(0, 'Stock must be at least 0'),
  vehicle_model_id: z.number().min(1, 'Vehicle Model is required'),
  is_available: z.boolean(),
  vehicle_make_id: z.number().min(1, 'Vehicle Make is required'),
});

export type PartSchemaType = z.infer<typeof partSchema>;
export { partSchema };