import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from '@/lib/utils/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema/*',
  out: './migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
