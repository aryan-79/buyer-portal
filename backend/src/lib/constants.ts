import { env } from './utils/env';

export const ROLES = ['user', 'admin'] as const;

const isProduction = env.NODE_ENV === 'production';

const COOKIE_CONFIG_BASE = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  ...(isProduction ? { domain: env.COOKIE_DOMAIN } : {}),
};

export const ACCESS_TOKEN_COOKIE_CONFG = {
  ...COOKIE_CONFIG_BASE,
  path: '/',
  maxAge: env.ACCESS_TOKEN_EXPIRY_TIME / 1000, // in seconds
};

export const REFRESH_TOKEN_COOKIE_CONFG = {
  ...COOKIE_CONFIG_BASE,
  path: '/auth/refresh', // sends cookie for this path only
  maxAge: env.REFRESH_TOKEN_EXPIRY_TIME / 1000, // in seconds
};
