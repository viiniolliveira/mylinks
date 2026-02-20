// src/auth.ts
import type { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";

type JwtPayload = { sub: string, iat: number, exp: number };

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is required");


export const generateToken = async (userId: string, expiresInDays: number = 365) => {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expiresInDays * 24 * 60 * 60; // Expira em X dias

    const token = await sign({ sub: userId, iat: now, exp } satisfies JwtPayload, JWT_SECRET, "HS256");
    return token;
}

export const hashPassword = async (password: string) => {
    const hashed = await Bun.password.hash(password);
    return hashed;
}

export const verifyPassword = async (password: string, hash: string) => {
    const isValid = await Bun.password.verify(password, hash);
    return isValid;
}

export const verifyToken = async (token: string) => {
    try {
        const payload = await verify(token, JWT_SECRET, "HS256") as JwtPayload;
        return payload;
    } catch {
        return null;
    }
}

// middleware: exige Authorization: Bearer <token>
export const requireAuth = async (c: Context, next: Next) => {
  const header = c.req.header("Authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return c.json({ error: "Missing token" }, 401);

  try {
    const payload = (await verify(token, JWT_SECRET, "HS256")) as JwtPayload;

    c.set("userId", payload.sub);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
};