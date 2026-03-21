import { relations } from 'drizzle-orm';
import { favourites } from './favourites';
import { properties } from './properties';
import { users } from './user';

export const userRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  favourites: many(favourites),
}));

export const propertiesRelations = relations(properties, ({ one }) => ({
  owner: one(users, {
    fields: [properties.ownerId],
    references: [users.id],
  }),
}));

export const favouritesRelations = relations(favourites, ({ one }) => ({
  user: one(users, {
    fields: [favourites.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [favourites.propertyId],
    references: [properties.id],
  }),
}));
