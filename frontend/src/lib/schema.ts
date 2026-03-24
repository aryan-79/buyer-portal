import z from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email' }),
  password: z.string().min(8, 'Password length must be at least 8 characters long'),
});

export const searchSchema = z.object({
  search: z.string().optional(),
});
