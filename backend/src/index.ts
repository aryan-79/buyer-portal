import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { openAPIRouteHandler } from 'hono-openapi';
import { ZodError } from 'zod';
import { env } from './lib/utils/env';
import { createErrorResopnse } from './lib/utils/response';
import authRoutes from './routes/auth.routes';

const app = new Hono();

app.onError(async (err, c) => {
  console.error('error: ', err);

  if (err instanceof ZodError) {
    const issues = err.issues;
    const firstIssue = issues.at(0);

    const errorMessage = firstIssue
      ? `Error in '${String(firstIssue.path?.at(-1))}': ${firstIssue.message}`
      : 'The provided input data is invalid.';

    return c.json(
      {
        success: false,
        message: errorMessage,
      },
      400,
    );
  }

  if (err instanceof HTTPException) {
    const res = createErrorResopnse(err);
    return c.json(res, err.status);
  }

  return c.json(
    {
      success: false,
      message: 'Internal Server Error',
    },
    500,
  );
});

app.route('/api', authRoutes);

app.get(
  '/openapi.json',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'Fareal State',
        version: '1.0.0',
        description: 'API for Fareal State',
      },
    },
  }),
);

app.get(
  '/docs',
  Scalar({
    pageTitle: 'API documentation for Fareal State',
    sources: [{ title: 'API documentation', url: '/openapi.json' }],
  }),
);

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
