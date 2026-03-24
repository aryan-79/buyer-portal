import { deleteCookie, getSignedCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { FORBIDDEN_MESSAGE, UNAUTHORIZED_MESSAGE } from '@/docs/error.docs';
import { env } from '../utils/env';
import { type ROLES, SESSION_COOKIE_NAME } from '../constants';
import { getSession, type SessionPayload } from '../utils/session';

type AuthorizationMiddlewareOptions = {
  roles?: Array<(typeof ROLES)[number]>;
  requireAuthentication?: boolean;
};

export const authorizationMiddleware = (options?: AuthorizationMiddlewareOptions) =>
  createMiddleware(async (c, next) => {
    const { roles, requireAuthentication = true } = options || {};

    const sessionId = await getSignedCookie(c, env.SESSION_SECRET, SESSION_COOKIE_NAME);

    console.log('session id: ', sessionId);

    if (requireAuthentication && !sessionId) {
      throw new HTTPException(401, {
        message: UNAUTHORIZED_MESSAGE,
      });
    }

    if (sessionId) {
      const session = await getSession(sessionId);

      console.log('session: ', session);

      c.set('user', session);

      if (!session) {
        deleteCookie(c, SESSION_COOKIE_NAME);
        throw new HTTPException(403, {
          message: UNAUTHORIZED_MESSAGE,
        });
      }
    }

    if (roles && roles.length > 0) {
      const user = c.get('user');
      if (!user || !roles.includes(user.role)) {
        throw new HTTPException(403, {
          message: FORBIDDEN_MESSAGE,
        });
      }
    }

    await next();
  });

declare module 'hono' {
  interface ContextVariableMap {
    user?: SessionPayload | null;
  }
}
