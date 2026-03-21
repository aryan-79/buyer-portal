import { describeRoute } from 'hono-openapi';
import { createPropertySchema, getPropertiesSchema } from '@/lib/schemas/properties.schema';
import { responseSpec } from '@/lib/utils/openapi';
import { errorSpecs } from './error.docs';

const tags = ['Properties'];

export const registerPropertySpec = describeRoute({
  tags,
  description: 'Register a property',
  responses: {
    201: responseSpec('success', {
      description: 'Property registered successfully',
      schema: createPropertySchema,
    }),
  },
});

export const getPropertiesRouteSpec = describeRoute({
  tags,
  description: 'Get list of properties',
  responses: {
    200: responseSpec('success', {
      schema: getPropertiesSchema,
      description: 'Properties fetched successfully',
    }),
    ...errorSpecs,
  },
});
