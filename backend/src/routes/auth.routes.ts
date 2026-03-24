import { Hono } from 'hono';
import { deleteCookie, getSignedCookie, setSignedCookie } from 'hono/cookie';
import { loginRouteSpec, logoutRouteSpec, sessionRouteSpec, signupRouteSpec } from '@/docs/auth.docs';
import { COOKIE_CONFIG, SESSION_COOKIE_NAME } from '@/lib/constants';
import { loginSchema, signupSchema } from '@/lib/schemas/auth.schema';
import { createSuccessResponse } from '@/lib/utils/response';
import { validator } from '@/lib/utils/validator';
import { deleteSession, getSessionUser, login, signup } from '@/services/auth';
import { env } from '@/lib/utils/env';
import { HTTPException } from 'hono/http-exception';
import { UNAUTHORIZED_MESSAGE } from '@/docs/error.docs';

const app = new Hono().basePath('auth');

app.post('/signup', signupRouteSpec, validator('json', signupSchema), async (c) => {
  const input = c.req.valid('json');

  const createdUser = await signup(input);

  const response = createSuccessResponse(createdUser, 'Signed up successfully');

  return c.json(response, 201);
});

app.post('/login', loginRouteSpec, validator('json', loginSchema), async (c) => {
  const input = c.req.valid('json');
  const { sessionId, user } = await login(input);

  const response = createSuccessResponse(user, 'Logged in successfully');

  await setSignedCookie(c, SESSION_COOKIE_NAME, sessionId, env.SESSION_SECRET, COOKIE_CONFIG);

  return c.json(response, 200);
});

app.post('/logout', logoutRouteSpec, async (c) => {
  const sessionId = await getSignedCookie(c, env.SESSION_SECRET, SESSION_COOKIE_NAME);

  const response = createSuccessResponse(null, 'Logged out successfully');

  if (!sessionId) return c.json(response, 200);

  deleteCookie(c, SESSION_COOKIE_NAME);
  await deleteSession(sessionId);

  return c.json(response, 200);
});

app.get('/session', sessionRouteSpec, async (c) => {
  const sessionId = await getSignedCookie(c, env.SESSION_SECRET, SESSION_COOKIE_NAME);

  if (!sessionId) {
    throw new HTTPException(401, {
      message: UNAUTHORIZED_MESSAGE,
    });
  }

  const user = await getSessionUser(sessionId);

  return c.json(user, 200);
});

export default app;
