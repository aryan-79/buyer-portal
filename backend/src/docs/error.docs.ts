import { responseSpec } from '@/lib/utils/openapi';

export const UNAUTHORIZED_MESSAGE = 'Not logged in. Please login first';
export const FORBIDDEN_MESSAGE = "You don't have required permission to perform this action";
export const INVALID_INPUT_MESSAGE = 'Invalid data received';
export const TOKEN_INVALID_MESSAGE = 'Invalid or expired token';

export const errorSpecs = {
  400: responseSpec('error', {
    description: 'Invalid data received',
  }),
  401: responseSpec('error', {
    description: UNAUTHORIZED_MESSAGE,
  }),
  403: responseSpec('error', {
    description: FORBIDDEN_MESSAGE,
  }),
  500: responseSpec('error', {
    description: 'Internal Server Error',
  }),
};
