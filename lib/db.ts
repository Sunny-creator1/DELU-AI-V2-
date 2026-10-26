import { cookies } from 'next/headers';
import crypto from 'crypto';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export const SESSION_COOKIE = 'delu_session';

const secret = process.env.SESSION_SECRET || 'dev-session-secret-change-me';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function signToken(payload: Record<string, string>) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expected = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionUser;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieValue = cookies().get(SESSION_COOKIE)?.value;
  if (!cookieValue) return null;
  return verifyToken(cookieValue) || null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/account');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/account');
  return user;
}

export async function setSessionCookie(user: SessionUser) {
  const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signInUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role } as SessionUser;
}

export async function createUserAccount(data: { name: string; email: string; password: string }) {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) return null;
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: await hashPassword(data.password),
      role: 'customer',
      emailVerified: false,
    },
  });

  return { id: user.id, email: user.email, name: user.name, role: user.role } as SessionUser;
}
