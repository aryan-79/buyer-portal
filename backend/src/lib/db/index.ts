import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../utils/env';
import * as schema from './schema';

const db = drizzle(env.DATABASE_URL, {
  schema,
});

export default db;
