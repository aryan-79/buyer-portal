import { Hono } from 'hono';
import { getPropertiesRouteSpec, registerPropertySpec } from '@/docs/properties.docs';
import { authorizationMiddleware } from '@/lib/middleware/auth';
import { createPropertySchema, propertyQuerySchema } from '@/lib/schemas/properties.schema';
import { createPaginatedSuccessResponse, createSuccessResponse } from '@/lib/utils/response';
import { validator } from '@/lib/utils/validator';
import { getProperties, registerProperty } from '@/services/properties';

const app = new Hono().basePath('properties');

app.post(
  '/',
  registerPropertySpec,
  authorizationMiddleware(['admin']),
  validator('json', createPropertySchema),
  async (c) => {
    const input = c.req.valid('json');
    const property = await registerProperty(input);

    const response = createSuccessResponse(property, 'Property registered successfully');

    return c.json(response, 201);
  },
);

app.get('/', getPropertiesRouteSpec, validator('query', propertyQuerySchema), async (c) => {
  const query = c.req.valid('query');
  const { properties, total } = await getProperties(query);

  const response = createPaginatedSuccessResponse(properties, 'Properties fetched successfully', 'properties', {
    page: query.page,
    limit: query.limit,
    total,
  });

  return c.json(response, 200);
});

export default app;
