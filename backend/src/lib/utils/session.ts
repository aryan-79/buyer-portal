import crypto from 'node:crypto';
import type { ROLES } from '../constants';
import { env } from './env';
import redis from './redis';

export type SessionPayload = {
  id: string;
  email: string;
  role: (typeof ROLES)[number];
  createdAt: number;
};

export type SessionCreatePayload = Omit<SessionPayload, 'createdAt'>;

function generateSessionId() {
  return crypto.randomBytes(128).toString('hex');
}

export async function createSession(payload: SessionCreatePayload) {
  const generatedId = generateSessionId();
  const sessionPayload = { ...payload, createdAt: Date.now() } satisfies SessionPayload;

  await redis.setEx(`session:${generatedId}`, env.SESSION_EXPIRY_TIME, JSON.stringify(sessionPayload));

  return generatedId;
}

export async function updateSession(sessionId: string, payload: SessionCreatePayload) {
  const sessionPayload = { ...payload, createdAt: Date.now() };

  await redis.setEx(`session:${sessionId}`, env.SESSION_EXPIRY_TIME, JSON.stringify(sessionPayload));
}

export async function deleteSession(sessionId: string) {
  const key = `session:${sessionId}`;
  await redis.del(key);

  return sessionId;
}

export async function getSession(sessionId: string): Promise<SessionPayload | null> {
  const key = `session:${sessionId}`;
  const rawPayload = await redis.get(key);

  if (!rawPayload) return null;

  const session = JSON.parse(rawPayload) as SessionPayload;

  const timeLeft = Date.now() - session.createdAt;

  if (timeLeft < 24 * 60 * 60 * 1000) {
    const { createdAt, ...update } = session;
    await updateSession(session.id, update);
  }

  return session;
}
