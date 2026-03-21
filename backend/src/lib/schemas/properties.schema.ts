import z from 'zod';
import { createPaginatedSuccessReponseSchema } from '../utils/pagination';

const propertyBaseSchema = z.object({
  title: z.string({ error: 'Title is required' }).min(3).max(255),
  description: z.string({ error: 'Description is required' }).min(10),
  price: z
    .string({ error: 'Price is required' })
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
    .transform(Number),
  currency: z
    .string({ error: 'Currency is required' })
    .min(2, 'Invalid currency code')
    .max(3, 'Invalid currency code')
    .toUpperCase(),
  area: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid area format')
    .transform(Number)
    .optional(),
  address: z.string({ error: 'Address is required' }).min(3),
  city: z.string({ error: 'City is required' }).min(2),
  country: z.string({ error: 'Country is required' }).min(2),
  bedroom: z.number({ error: 'Bedroom count is required' }).int().min(0).default(0),
  kitchen: z.number({ error: 'Kitchen count is required' }).int().min(0).default(0),
  bathroom: z.number({ error: 'Bathroom count is required' }).int().min(0).default(0),
  livingroom: z.number({ error: 'Living room count is required' }).int().min(0).default(0),
});

export const createPropertySchema = propertyBaseSchema;

export const updatePropertySchema = propertyBaseSchema.partial();

export const propertyIdSchema = z.object({
  id: z.uuid('Invalid property ID'),
});

export const propertyQuerySchema = z.object({
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  bedroom: z.coerce.number().int().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export const getPropertiesSchema = createPaginatedSuccessReponseSchema(z.array(createPropertySchema), 'properties');

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyQuery = z.infer<typeof propertyQuerySchema>;
