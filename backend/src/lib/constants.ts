import { env } from './utils/env';

export const ROLES = ['user', 'admin'] as const;

const isProduction = env.NODE_ENV === 'production';

export const SESSION_COOKIE_NAME = 'session-token';

export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  ...(isProduction ? { domain: env.COOKIE_DOMAIN } : {}),
};
