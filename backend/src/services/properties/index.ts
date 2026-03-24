import { and, DrizzleQueryError, desc, eq, gt, ilike, lt, or, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import db from '@/lib/db';
import { favourites, properties } from '@/lib/db/schema';
import type { CreatePropertyInput, PropertyQuery } from '@/lib/schemas/properties.schema';
import { getOffset } from '@/lib/utils/pagination';

export async function registerProperty(input: CreatePropertyInput) {
  const [newProperty] = await db.insert(properties).values(input).returning();

  return newProperty;
}

export async function getProperties({
  page,
  limit,
  userId,
  orderBy = 'createdAt',
  ...query
}: PropertyQuery & { userId?: string; orderBy?: 'favourites' | 'createdAt' }) {
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
    extras: {
      isFavourited: userId
        ? sql<boolean>`EXISTS (
        SELECT 1 FROM "favourites"
        WHERE "favourites"."property_id" = "properties"."id"
        AND "favourites"."user_id" = ${userId}
      )`.as('is_favourited')
        : sql<boolean>`false`.as('is_favourited'),
    },
    orderBy: desc(orderBy === 'favourites' ? properties.favouriteCount : properties.listedAt),
    offset: getOffset(page, limit),
    limit,
  });

  const total = await db.$count(properties, filters);

  console.log('results: ', results);
  console.log('search: ', query.search);
  console.log('userid: ', userId);

  return { properties: results, total };
}

export async function updateFavourite(userId: string, propertyId: string, action: 'add' | 'remove') {
  try {
    return await db.transaction(async (tx) => {
      const isAdd = action === 'add';

      const [favourite] = isAdd
        ? await tx.insert(favourites).values({ userId, propertyId }).returning()
        : await tx
            .delete(favourites)
            .where(and(eq(favourites.userId, userId), eq(favourites.propertyId, propertyId)))
            .returning();

      if (!favourite) throw new HTTPException(404, { message: 'Favourite not found' });

      const [{ favouriteCount }] = await tx
        .update(properties)
        .set({ favouriteCount: sql`${properties.favouriteCount} ${isAdd ? sql`+ 1` : sql`- 1`}` })
        .where(eq(properties.id, propertyId))
        .returning({ favouriteCount: properties.favouriteCount });

      return {
        propertyId: favourite.propertyId,
        favouritedAt: favourite.favouritedAt,
        favouriteCount,
      };
    });
  } catch (err) {
    if (err instanceof DrizzleQueryError) {
      if (err.cause && 'detail' in err.cause && 'code' in err.cause && err.cause.code === '23505') {
        throw new HTTPException(409, {
          message: 'This property is already in your favourite list',
        });
      }
    }

    throw err;
  }
}

export async function getPropertyById(propertyId: string) {
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, propertyId),
    columns: {
      ownerId: false,
    },
  });

  if (!property) {
    throw new HTTPException(404, {
      message: 'Property not found',
    });
  }

  return property;
}

export async function deleteProperty(propertyId: string) {
  const [deletedProperty] = await db.delete(properties).where(eq(properties.id, propertyId)).returning();
  return deletedProperty;
}

export async function getFavourites(userId: string, { page, limit, ...query }: PropertyQuery) {
  const filters = and(
    eq(favourites.userId, userId),
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

  const propertiesPromise = db
    .select({
      id: favourites.id,
      favouritedAt: favourites.favouritedAt,
      property: {
        id: properties.id,
        title: properties.title,
        description: properties.description,
        price: properties.price,
        currency: properties.currency,
        area: properties.area,
        address: properties.address,
        city: properties.city,
        country: properties.country,
        bedroom: properties.bedroom,
        kitchen: properties.kitchen,
        bathroom: properties.bathroom,
        livingroom: properties.livingroom,
        favouriteCount: properties.favouriteCount,
        listedAt: properties.listedAt,
        updatedAt: properties.updatedAt,
        isFavourited: sql<boolean>`true`.as('is_favourited'),
        coverImage: properties.coverImage,
        images: properties.images,
      },
    })
    .from(favourites)
    .innerJoin(properties, eq(favourites.propertyId, properties.id))
    .where(filters);

  const countsPromise = db
    .select({ total: sql<number>`count(*)` })
    .from(favourites)
    .innerJoin(properties, eq(favourites.propertyId, properties.id))
    .where(filters);

  const [results, [{ total }]] = await Promise.all([propertiesPromise, countsPromise]);

  return { favourites: results, total };
}
