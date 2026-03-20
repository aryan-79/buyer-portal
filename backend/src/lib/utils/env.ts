import z, { ZodError } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number(),
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
