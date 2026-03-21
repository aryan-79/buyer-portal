import { index, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { properties } from './properties';
import { users } from './user';

export const favourites = pgTable(
  'favourites',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    propertyId: uuid('property_id')
      .notNull()
      .references(() => properties.id, {
        onDelete: 'cascade',
      }),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'no action',
      }),

    favouritedAt: timestamp('favourited_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('favourites_user_property_uidx').on(table.userId, table.propertyId),
    index('favourites_property_idx').on(table.propertyId),
  ],
);
