import { Hono } from 'hono';
import {
  addFavouriteRouteSpec,
  deletePropertyByIdRouteSpec,
  getFavouritesRouteSpec,
  getPropertiesRouteSpec,
  getPropertyByIdRouteSpec,
  registerPropertySpec,
  removeFavouriteRouteSpec,
} from '@/docs/properties.docs';
import { authorizationMiddleware } from '@/lib/middleware/auth';
import { createPropertySchema, propertyQuerySchema } from '@/lib/schemas/properties.schema';
import { createPaginatedSuccessResponse, createSuccessResponse } from '@/lib/utils/response';
import { validator } from '@/lib/utils/validator';
import {
  deleteProperty,
  getFavourites,
  getProperties,
  getPropertyById,
  registerProperty,
  updateFavourite,
} from '@/services/properties';

const app = new Hono().basePath('properties');

app.post(
  '/',
  registerPropertySpec,
  authorizationMiddleware({
    roles: ['admin'],
  }),
  validator('json', createPropertySchema),
  async (c) => {
    const input = c.req.valid('json');
    const property = await registerProperty(input);

    const response = createSuccessResponse(property, 'Property registered successfully');

    return c.json(response, 201);
  },
);

app.get(
  '/',
  getPropertiesRouteSpec,
  authorizationMiddleware({
    requireAuthentication: false,
  }),
  validator('query', propertyQuerySchema),
  async (c) => {
    const user = c.get('user');

    const query = c.req.valid('query');
    const { properties, total } = await getProperties({ ...query, userId: user?.id, orderBy: 'createdAt' });

    const response = createPaginatedSuccessResponse(properties, 'Properties fetched successfully', 'properties', {
      page: query.page,
      limit: query.limit,
      total,
    });

    return c.json(response, 200);
  },
);

app.get(
  '/favourites',
  getFavouritesRouteSpec,
  authorizationMiddleware(),
  validator('query', propertyQuerySchema),
  async (c) => {
    // biome-ignore lint/style/noNonNullAssertion: authorizationMiddleware with default options will throw exception if user is not authenticated or has invalid token, so user object is always attached
    const { id } = c.get('user')!;
    const query = c.req.valid('query');

    const properties = await getFavourites(id, query);

    const response = createPaginatedSuccessResponse(
      properties.favourites,
      'Favourites fetched successfully',
      'favourites',
      {
        page: query.page,
        limit: query.limit,
        total: properties.total,
      },
    );

    return c.json(response, 200);
  },
);

app.post('/favourites/:propertyId', addFavouriteRouteSpec, authorizationMiddleware(), async (c) => {
  // biome-ignore lint/style/noNonNullAssertion: authorizationMiddleware with default options will throw exception if user is not authenticated or has invalid token, so user object is always attached
  const { id } = c.get('user')!;
  const propertyId = c.req.param('propertyId');

  const property = await updateFavourite(id, propertyId, 'add');
  const response = createSuccessResponse(property, 'Property added to favourite');

  return c.json(response, 201);
});

app.delete('/favourites/:propertyId', removeFavouriteRouteSpec, authorizationMiddleware(), async (c) => {
  // biome-ignore lint/style/noNonNullAssertion: authorizationMiddleware with default options will throw exception if user is not authenticated or has invalid token, so user object is always attached
  const { id } = c.get('user')!;
  const propertyId = c.req.param('propertyId');

  const property = await updateFavourite(id, propertyId, 'remove');
  const response = createSuccessResponse(property, 'Property removed from favourite');

  return c.json(response, 200);
});

app.get('/:propertyId', getPropertyByIdRouteSpec, async (c) => {
  const propertyId = c.req.param('propertyId');

  const property = await getPropertyById(propertyId);
  const response = createSuccessResponse(property, 'Property details fetched successfully');

  return c.json(response, 200);
});

app.delete(
  '/:propertyId',
  deletePropertyByIdRouteSpec,
  authorizationMiddleware({
    requireAuthentication: true,
    roles: ['admin'],
  }),
  async (c) => {
    const propertyId = c.req.param('propertyId');

    const deletedProperty = await deleteProperty(propertyId);

    const response = createSuccessResponse(deletedProperty, 'Property deleted successfully');

    return c.json(response, 200);
  },
);

export default app;
