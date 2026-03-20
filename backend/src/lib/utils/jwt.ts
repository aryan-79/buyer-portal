import jwt from 'jsonwebtoken';
import type { ROLES } from '../constants';
import { env } from './env';

export type TokenPayload = {
  id: string;
  fullName: string;
  email: string;
  role: (typeof ROLES)[number];
};

type TokenType = 'access-token' | 'refresh-token';

export function signJWT(payload: TokenPayload, type: TokenType) {
  const expiresIn = type === 'access-token' ? env.ACCESS_TOKEN_EXPIRY_TIME : env.REFRESH_TOKEN_EXPIRY_TIME;

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn,
  });

  return token;
}

export function validateJWT(token: string) {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Invalid token: ', error);
  }
}
