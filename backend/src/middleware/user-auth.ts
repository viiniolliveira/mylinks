import { Context, Next } from "hono";
import { verifyToken } from "@/lib/auht";

export const userAuth = async (c: Context, next: Next) => {
  const header = c.req.header("Authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return c.json({ error: "Missing token" }, 401);

  try {
    const payload = await verifyToken(token);

    if (!payload?.sub) return c.json({ error: "Unauthorized" }, 401);

    c.set("userId", payload?.sub || "");
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
};