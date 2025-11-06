import { z } from 'zod'

export const proposalSchema = z.object({
  amount: z.string().min(1, 'Amount required'),
  message: z.string().optional(),
})

export const commentSchema = z.object({
  proposalId: z.number(),
  content: z.string(),
  userId: z.number()
})
