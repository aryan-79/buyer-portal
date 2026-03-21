import { deleteCookie, getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { ACCESS_TOKEN_COOKIE_NAME, type ROLES } from '../constants';
import { type TokenPayload, validateJWT } from '../utils/jwt';

export const authorizationMiddleware = (roles?: Array<(typeof ROLES)[number]>) =>
  createMiddleware(async (c, next) => {
    const accessToken = getCookie(c, ACCESS_TOKEN_COOKIE_NAME);

    if (accessToken) {
      const decoded = validateJWT(accessToken);

      if (!decoded) {
        deleteCookie(c, ACCESS_TOKEN_COOKIE_NAME);
      }

      c.set('user', decoded);
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
