import type { HTTPException } from 'hono/http-exception';

export function createSuccessResponse<T>(data: T, message: string) {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Creates a standardized paginated success response.
 * @template T
 * @param data - The paginated result set.
 * @param message - A human-readable success message.
 * @param fieldName - The key under which the data will be exposed in the response.
 * @param options - Pagination metadata.
 * @param options.page - Current page number.
 * @param options.limit - Number of items per page.
 * @param options.total - Total number of available items.
 *
 * @returns An object containing the success flag, message, and paginated data.
 */
export function createPaginatedSuccessResponse<T>(
  data: T,
  message: string,
  fieldName: string,
  {
    page,
    limit,
    total,
  }: {
    page: number;
    limit: number;
    total: number;
  },
) {
  return {
    success: true,
    message,
    data: {
      [fieldName]: data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export function createErrorResopnse(error: HTTPException) {
  return {
    success: false,
    message: error.message,
  };
}
