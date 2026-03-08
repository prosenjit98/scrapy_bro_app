import { z } from 'zod'

export const proposalSchema = z.object({
  price: z.string().min(1, 'Amount required'),
  description: z.string().optional(),
  quantity: z.string().min(1, 'Quantity must be at least 1').optional()
})

export const commentSchema = z.object({
  bargainId: z.number().optional(),
  proposalId: z.number().optional(),
  content: z.string(),
  userId: z.number()
})
