import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters required'),
})

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.email({ message: 'Invalid email address' }).trim().toLowerCase(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['user', 'vendor'], { message: 'Please select a role' }).optional().nullable(),
  agree: z.literal([true, false], { message: 'You must agree to continue' }),
  address: z.string().min(2, { message: 'Name must be at least 4 characters' }).trim().optional(),
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  confirmPassword: z.string().min(6, 'Confirm password required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})