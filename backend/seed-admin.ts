import 'dotenv/config';

import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { users } from '@/lib/db/schema';
import { env } from '@/lib/utils/env';

async function seed() {
  console.log('Seeding admin...');

  await db.delete(users);

  const [user] = await db
    .insert(users)
    .values({
      fullName: 'Admin',
      email: env.ADMIN_EMAIL,
      password: await bcrypt.hash(env.ADMIN_PASSWORD, 10),
      role: 'admin',
      image: null,
    })
    .returning();

  console.log('✅ Seeded user:', user.email);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
