import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { UNAUTHORIZED_MESSAGE } from '@/docs/error.docs';
import db from '@/lib/db';
import { users } from '@/lib/db/schema';
import type { LoginInput, SignupInput } from '@/lib/schemas/auth.schema';
import {
  createSession,
  getSession,
  deleteSession as deleteRedisSession,
  type SessionCreatePayload,
} from '@/lib/utils/session';

const INVALID_TOKEN_MESSAGE = 'Missing or invalid token';

export async function signup(input: SignupInput) {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const [user] = await db
    .insert(users)
    .values({ ...input, password: hashedPassword })
    .returning();

  return user;
}

export async function login({ email, password }: LoginInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new HTTPException(404, {
      message: 'User not found',
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new HTTPException(401, {
      message: 'Invalid email or password',
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  } satisfies SessionCreatePayload;

  const sessionId = await createSession(payload);

  return {
    sessionId,
    user,
  };
}

export async function deleteSession(sessionId: string) {
  await deleteRedisSession(sessionId);
}

export async function getSessionUser(sessionId: string) {
  const session = await getSession(sessionId);

  if (!session) {
    throw new HTTPException(401, {
      message: UNAUTHORIZED_MESSAGE,
    });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.email),
    columns: {
      password: false,
    },
  });

  if (!user) {
    throw new HTTPException(401, {
      message: INVALID_TOKEN_MESSAGE,
    });
  }

  return user;
}
