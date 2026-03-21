import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const isServer = typeof window === 'undefined';

export const env = createEnv({
  isServer,
  server: {
    API_URL: z.url(),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_API_URL: z.url(),
  },

  runtimeEnv: isServer ? process.env : import.meta.env,

  emptyStringAsUndefined: true,
});
