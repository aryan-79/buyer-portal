import { resolver } from 'hono-openapi';
import z from 'zod';

type ResponseFormat = 'success' | 'error';

type SuccessResponseInput = {
  description: string;
  schema: z.ZodType;
};

type ErrorResponseInput = {
  description: string;
};

export function responseSpec<Format extends ResponseFormat>(
  format: Format,
  body: Format extends 'success' ? SuccessResponseInput : ErrorResponseInput,
) {
  if (format === 'success') {
    const successBody = body as SuccessResponseInput;
    return successResponseContent(successBody.description, successBody.schema);
  }

  return errorResponseContent(body.description);
}

function successResponseContent<T extends z.ZodType>(description: string, schema: T) {
  return {
    description,
    content: {
      'application/json': {
        schema: resolver(
          z.object({
            success: z.boolean().default(true),
            message: z.literal(description),
            data: schema,
          }),
        ),
      },
    },
  };
}

function errorResponseContent(description: string) {
  return {
    description,
    content: {
      'application/json': {
        schema: resolver(
          z.object({
            success: z.boolean().default(false),
            message: z.literal(description),
          }),
        ),
      },
    },
  };
}
