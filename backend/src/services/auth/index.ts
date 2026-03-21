import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { UNAUTHORIZED_MESSAGE } from '@/docs/error.docs';
import db from '@/lib/db';
import { users } from '@/lib/db/schema';
import type { LoginInput, SignupInput } from '@/lib/schemas/auth.schema';
import { signJWT, type TokenPayload, validateJWT } from '@/lib/utils/jwt';

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

  const jwtPayload = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  } satisfies TokenPayload;

  const accessToken = signJWT(jwtPayload, 'access-token');
  const refreshToken = signJWT(jwtPayload, 'refresh-token');

  return {
    accessToken,
    refreshToken,
    user,
  };
}

export async function getNewToken(token?: string) {
  if (!token) {
    throw new HTTPException(401, {
      message: UNAUTHORIZED_MESSAGE,
    });
  }

  const validated = validateJWT(token);
  if (!validated) {
    throw new HTTPException(401, {
      message: INVALID_TOKEN_MESSAGE,
    });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, validated.email),
  });
  if (!user) {
    throw new HTTPException(401, {
      message: INVALID_TOKEN_MESSAGE,
    });
  }
  const jwtPayload = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  } satisfies TokenPayload;

  const accessToken = signJWT(jwtPayload, 'access-token');
  const refreshToken = signJWT(jwtPayload, 'refresh-token');

  return { accessToken, refreshToken };
}

export async function getSessionUser(accessToken?: string) {
  if (!accessToken) {
    throw new HTTPException(401, {
      message: UNAUTHORIZED_MESSAGE,
    });
  }

  const decoded = validateJWT(accessToken);

  if (!decoded) {
    throw new HTTPException(401, {
      message: INVALID_TOKEN_MESSAGE,
    });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, decoded.email),
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
