import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { loginRouteSpec, signupRouteSpec } from '@/docs/auth.docs';
import { ACCESS_TOKEN_COOKIE_CONFG, REFRESH_TOKEN_COOKIE_CONFG } from '@/lib/constants';
import { loginSchema, signupSchema } from '@/lib/schemas/auth.schema';
import { createSuccessResponse } from '@/lib/utils/response';
import { validator } from '@/lib/utils/validator';
import { login, signup } from '@/services/auth';

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

  setCookie(c, 'access_token', accessToken, ACCESS_TOKEN_COOKIE_CONFG);
  setCookie(c, 'refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_CONFG);

  return c.json(response, 200);
});

export default app;
