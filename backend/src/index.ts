import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Scalar } from '@scalar/hono-api-reference';
import { DrizzleQueryError } from 'drizzle-orm';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { openAPIRouteHandler } from 'hono-openapi';
import { ZodError } from 'zod';
import { env } from './lib/utils/env';
import { createErrorResopnse } from './lib/utils/response';
import authRoutes from './routes/auth.routes';
import propertiesRoutes from './routes/properties.routes';

const app = new Hono();

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

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

  if (err instanceof DrizzleQueryError) {
    //INFO: DrizzleQueryError: 23505 is the code for duplicate key in postgres
    if (err.cause && 'detail' in err.cause && 'code' in err.cause && err.cause.code === '23505') {
      console.error('Drizzle error \n', err.cause.detail);
      console.error('Error code: ', err.cause.code);
      const errMessage = err.cause.detail as string;

      const [, key, value] = errMessage.match(/Key \((\w+)\)=\(([^)]+)\)/) || [];

      return c.json(
        {
          success: false,
          message: value && key ? `Duplicate ${key}: ${value}` : 'Duplicate value',
        },
        409,
      );
    }
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
app.route('/api', propertiesRoutes);

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
