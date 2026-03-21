import { deleteCookie, getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { UNAUTHORIZED_MESSAGE } from '@/docs/error.docs';
import { ACCESS_TOKEN_COOKIE_NAME, type ROLES } from '../constants';
import { type TokenPayload, validateJWT } from '../utils/jwt';

type AuthorizationMiddlewareOptions = {
  roles?: Array<(typeof ROLES)[number]>;
  requireAuthentication?: boolean;
};

export const authorizationMiddleware = (options?: AuthorizationMiddlewareOptions) =>
  createMiddleware(async (c, next) => {
    const { roles, requireAuthentication = true } = options || {};

    const accessToken = getCookie(c, ACCESS_TOKEN_COOKIE_NAME);

    const throwUnauthenticated = () => {
      throw new HTTPException(401, {
        message: UNAUTHORIZED_MESSAGE,
      });
    };

    if (requireAuthentication && !accessToken) {
      throwUnauthenticated();
    }

    if (accessToken) {
      const decoded = validateJWT(accessToken);

      c.set('user', decoded);

      if (!decoded) {
        deleteCookie(c, ACCESS_TOKEN_COOKIE_NAME);
        throwUnauthenticated();
      }
    }

    if (roles && roles.length > 0) {
      const user = c.get('user');
      if (!user || !roles.includes(user.role)) {
        throw new HTTPException(403, {
          message: 'You dont have permission to access this resource',
        });
      }
    }

    await next();
  });

declare module 'hono' {
  interface ContextVariableMap {
    user?: TokenPayload | undefined;
  }
}
