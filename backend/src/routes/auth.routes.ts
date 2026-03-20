import { Hono } from 'hono';
import { signupRouteSpec } from '@/docs/auth.docs';
import { signupSchema } from '@/lib/schemas/auth.schema';
import { createSuccessResponse } from '@/lib/utils/response';
import { validator } from '@/lib/utils/validator';

const app = new Hono().basePath('auth');

app.post('/signup', signupRouteSpec, validator('json', signupSchema), (c) => {
  const input = c.req.valid('json');

  const response = createSuccessResponse(input, 'Signed up successfully');

  return c.json(response, 201);
});

export default app;
