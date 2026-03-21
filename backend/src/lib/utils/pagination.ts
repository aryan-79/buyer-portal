import z from 'zod';

/**
 * @param page  - Page number (1-based). Values less than 1 default to page 1.
 * @param limit - Number of records per page.
 * @returns The 0-based offset to use in a database query.
 */
export function getOffset(page: number, limit: number) {
  if (page < 1) {
    return 0;
  }

  return (page - 1) * limit;
}

export function createPaginatedSuccessReponseSchema<T extends z.ZodType>(schema: T, fieldName: string) {
  return z.object({
    [fieldName]: schema,
    page: z.number().default(1),
    limit: z.number().default(10),
    total: z.number().default(0),
  });
}
