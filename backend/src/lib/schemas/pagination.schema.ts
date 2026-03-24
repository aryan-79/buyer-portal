import z from 'zod';

export function createPaginatedSuccessReponseSchema<T extends z.ZodType>(schema: T, fieldName: string) {
  return z.object({
    [fieldName]: schema,
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  });
}

export const basePaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

export type Pagination = z.infer<typeof basePaginationSchema>;
