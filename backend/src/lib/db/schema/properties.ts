import { index, integer, numeric, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './user';

export const properties = pgTable(
  'properties',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    title: text('title').notNull(),
    description: text('description').notNull(),

    price: numeric({ precision: 15, scale: 2, mode: 'number' }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull(),

    area: numeric({
      precision: 8,
      scale: 2,
      mode: 'number',
    }),

    address: text('address').notNull(),
    city: text('city').notNull(),
    country: text('country').notNull(),

    bedroom: integer('bedroom').notNull(),
    kitchen: integer('kitchen').notNull(),
    bathroom: integer('bathroom').notNull(),
    livingroom: integer('livingroom').notNull(),

    favouriteCount: integer('favourite_count').default(0).notNull(),

    ownerId: uuid('owner_id').references(() => users.id, {
      onDelete: 'set null',
    }),

    listedAt: timestamp('listed_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('propery_id_idx').on(table.id)],
);
