import { describeRoute } from 'hono-openapi';
import { loginResponseSchema, sessionResponseSchema, signupResponseSchema } from '@/lib/schemas/auth.schema';
import { responseSpec } from '@/lib/utils/openapi';
import { errorSpecs } from './error.docs';

const tags = ['Auth'];

export const signupRouteSpec = describeRoute({
  tags,
  description: 'Register a user',
  responses: {
    201: responseSpec('success', {
      description: 'Registered successfully',
      schema: signupResponseSchema,
    }),
    500: errorSpecs[500],
  },
});

export const loginRouteSpec = describeRoute({
  tags,
  description: 'Login with email and password',
  responses: {
    200: responseSpec('success', {
      description: 'Logged in successfully',
      schema: loginResponseSchema,
    }),
    ...errorSpecs,
  },
});

export const refreshRouteSpec = describeRoute({
  tags,
  description: 'Refresh access token using refresh token',
  responses: {
    204: {
      description: 'Tokens refreshed successfully',
    },
    ...errorSpecs,
  },
});

export const sessionRouteSpec = describeRoute({
  tags,
  description: 'Get current session user',
  responses: {
    200: responseSpec('success', {
      description: 'Session user retrieved successfully',
      schema: sessionResponseSchema,
    }),
    ...errorSpecs,
  },
});
