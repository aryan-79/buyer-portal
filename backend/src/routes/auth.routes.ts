import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { loginRouteSpec, refreshRouteSpec, sessionRouteSpec, signupRouteSpec } from '@/docs/auth.docs';
import {
  ACCESS_TOKEN_COOKIE_CONFG,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_CONFG,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/lib/constants';
import { loginSchema, signupSchema } from '@/lib/schemas/auth.schema';
import { createSuccessResponse } from '@/lib/utils/response';
import { validator } from '@/lib/utils/validator';
import { getNewToken, getSessionUser, login, signup } from '@/services/auth';

const app = new Hono().basePath('auth');

app.post('/signup', signupRouteSpec, validator('json', signupSchema), async (c) => {
  const input = c.req.valid('json');

  const createdUser = await signup(input);

  const response = createSuccessResponse(createdUser, 'Signed up successfully');

  return c.json(response, 201);
});

app.post('/login', loginRouteSpec, validator('json', loginSchema), async (c) => {
  const input = c.req.valid('json');
  const { accessToken, refreshToken, user } = await login(input);

  const response = createSuccessResponse(user, 'Logged in successfully');

  setCookie(c, ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_CONFG);
  setCookie(c, REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_CONFG);

  return c.json(response, 200);
});

app.post('/refresh', refreshRouteSpec, async (c) => {
  const token = getCookie(c, REFRESH_TOKEN_COOKIE_NAME);

  const { accessToken, refreshToken } = await getNewToken(token);
  setCookie(c, ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_CONFG);
  setCookie(c, REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_CONFG);

  return c.body(null, 204);
});

app.get('/session', sessionRouteSpec, async (c) => {
  const accessToken = getCookie(c, ACCESS_TOKEN_COOKIE_NAME);
  const user = await getSessionUser(accessToken);

  return c.json(user, 200);
});

export default app;
