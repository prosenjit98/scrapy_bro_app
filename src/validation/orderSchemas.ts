import { z } from 'zod';

export const orderSchema = z.object({
  productId: z.string().nonempty('Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().positive('Price must be a positive number'),
  customerId: z.string().nonempty('Customer ID is required'),
  address: z.string().nonempty('Address is required'),
  notes: z.string().optional(),
});

export type OrderSchemaType = z.infer<typeof orderSchema>;