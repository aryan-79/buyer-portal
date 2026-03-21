import { and, eq, gt, ilike, lt, or } from 'drizzle-orm';
import db from '@/lib/db';
import { properties } from '@/lib/db/schema';
import type { CreatePropertyInput, PropertyQuery } from '@/lib/schemas/properties.schema';
import { getOffset } from '@/lib/utils/pagination';

export async function registerProperty(input: CreatePropertyInput) {
  const [newProperty] = await db.insert(properties).values(input).returning();

  return newProperty;
}

export async function getProperties({ page, limit, ...query }: PropertyQuery) {
  const filters = and(
    query.minPrice ? gt(properties.price, query.minPrice) : undefined,
    query.maxPrice ? lt(properties.price, query.maxPrice) : undefined,
    query.bedroom ? eq(properties.bedroom, query.bedroom) : undefined,
    query.search
      ? or(
          ilike(properties.title, `%${query.search}%`),
          ilike(properties.city, `%${query.search}%`),
          ilike(properties.country, `%${query.search}%`),
        )
      : undefined,
  );

  const results = await db.query.properties.findMany({
    where: filters,
    with: {
      owner: true,
    },
    columns: {
      ownerId: false,
    },
    offset: getOffset(page, limit),
    limit,
  });

  const total = await db.$count(properties, filters);

  return { properties: results, total };
}
