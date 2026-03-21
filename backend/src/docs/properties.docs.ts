import { describeRoute } from 'hono-openapi';
import {
  addFavouriteResponseSchema,
  createPropertySchema,
  getPropertiesSchema,
  propertyResponseSchema,
  removeFavouriteResonseSchema,
} from '@/lib/schemas/properties.schema';
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

export const getFavouritesRouteSpec = describeRoute({
  tags,
  description: 'Get list of favourite properties',
  responses: {
    200: responseSpec('success', {
      schema: getPropertiesSchema,
      description: 'Properties fetched successfully',
    }),
    ...errorSpecs,
  },
});

export const getPropertyByIdRouteSpec = describeRoute({
  tags,
  description: 'Get property by ID',
  responses: {
    200: responseSpec('success', {
      schema: propertyResponseSchema,
      description: 'Property fetched successfully',
    }),
    ...errorSpecs,
  },
});

export const addFavouriteRouteSpec = describeRoute({
  tags,
  description: 'Add property to favourites',
  responses: {
    201: responseSpec('success', {
      schema: addFavouriteResponseSchema,
      description: 'Property added to favourites',
    }),
    ...errorSpecs,
  },
});

export const removeFavouriteRouteSpec = describeRoute({
  tags,
  description: 'Remove property to favourites',
  responses: {
    200: responseSpec('success', {
      schema: removeFavouriteResonseSchema,
      description: 'Property removed from favourites',
    }),
    ...errorSpecs,
  },
});
