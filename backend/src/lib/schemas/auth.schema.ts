import z from 'zod';

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters long')
    .max(40, 'Full name must be at most 40 characters long'),

  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupResponseSchema = z.object({
  id: z.uuid(),
  fullName: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
