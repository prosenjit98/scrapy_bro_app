import { z } from 'zod'

export const inquirySchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  vehicleMake: z.int(),
  vehicleModel: z.int()
})