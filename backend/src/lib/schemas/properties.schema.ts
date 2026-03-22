import z from 'zod';
import { basePaginationSchema, createPaginatedSuccessReponseSchema } from './pagination.schema';

const propertyBaseSchema = z.object({
  title: z.string({ error: 'Title is required' }).min(3).max(255),
  description: z.string({ error: 'Description is required' }).min(10),
  price: z.coerce.number().refine((val) => /^\d+(\.\d{1,2})?$/.test(String(val)), { error: 'Invalid price' }),
  currency: z
    .string({ error: 'Currency is required' })
    .min(2, 'Invalid currency code')
    .max(3, 'Invalid currency code')
    .toUpperCase(),
  area: z.coerce
    .number()
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(String(val)), { error: 'Invalid area' })
    .optional(),
  address: z.string({ error: 'Address is required' }).min(3),
  city: z.string({ error: 'City is required' }).min(2),
  country: z.string({ error: 'Country is required' }).min(2),
  bedroom: z.number({ error: 'Bedroom count is required' }).int().min(0).default(0),
  kitchen: z.number({ error: 'Kitchen count is required' }).int().min(0).default(0),
  bathroom: z.number({ error: 'Bathroom count is required' }).int().min(0).default(0),
  livingroom: z.number({ error: 'Living room count is required' }).int().min(0).default(0),
  coverImage: z.url({ error: 'Cover image for property is required' }),
  images: z.array(z.url()).optional(),
});

export const createPropertySchema = propertyBaseSchema;

export const updatePropertySchema = propertyBaseSchema.partial();

export const propertyIdSchema = z.object({
  id: z.uuid('Invalid property ID'),
});

export const propertyQuerySchema = basePaginationSchema.extend({
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  bedroom: z.coerce.number().int().min(0).optional(),
  search: z.string().optional(),
});

export const getPropertiesSchema = createPaginatedSuccessReponseSchema(z.array(createPropertySchema), 'properties');

export const propertyResponseSchema = createPropertySchema.extend({
  id: z.uuid(),
  favouriteCount: z.number().default(0),
  listedAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const addFavouriteResponseSchema = z.object({
  propertyId: z.uuid(),
  favouritedAt: z.iso.datetime(),
  favouriteCount: z.number().int(),
});

export const removeFavouriteResonseSchema = addFavouriteResponseSchema;

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyQuery = z.infer<typeof propertyQuerySchema>;
