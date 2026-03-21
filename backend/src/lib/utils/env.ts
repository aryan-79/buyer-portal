import z, { ZodError } from 'zod';

function parseDuration(duration: string): number {
  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid duration format: ${duration}`);

  const [, value, unit] = match;
  return parseInt(value, 10) * units[unit];
}

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  DATABASE_URL: z.url(),
  PORT: z.coerce.number(),
  JWT_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY_TIME: z.string().transform((val, ctx) => {
    try {
      return parseDuration(val);
    } catch {
      ctx.addIssue({
        code: 'custom',
        message: `Invalid duration format: "${val}". Expected format: 15m, 7d, 1h, 30s`,
      });

      return z.NEVER;
    }
  }),
  REFRESH_TOKEN_EXPIRY_TIME: z.string().transform((val, ctx) => {
    try {
      return parseDuration(val);
    } catch {
      ctx.addIssue({
        code: 'custom',
        message: `Invalid duration format: "${val}". Expected format: 15m, 7d, 1h, 30s`,
      });

      return z.NEVER;
    }
  }),
  COOKIE_DOMAIN: z.string(),
  ADMIN_PASSWORD: z.string().min(8, 'Password must be at least 8 characters'),
  ADMIN_EMAIL: z.email(),
  ALLOWED_ORIGINS: z.preprocess((val) => {
    if (typeof val === 'string') {
      const urls = val.split(',').map((url) => url.trim());
      return urls;
    }
    return val;
  }, z.array(z.url())),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      for (const issue of error.issues) {
        console.error(` - ${issue.path.join(' ')} : ${issue.message}`);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

export const env = validateEnv();
