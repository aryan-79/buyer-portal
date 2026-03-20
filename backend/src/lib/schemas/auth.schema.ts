import z from 'zod';
import { ROLES } from '../constants';

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters long')
    .max(40, 'Full name must be at most 40 characters long'),

  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const signupResponseSchema = z.object({
  id: z.uuid(),
  fullName: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  id: z.uuid(),
  fullName: z.string(),
  role: z.enum(ROLES),
  email: z.email(),
});
