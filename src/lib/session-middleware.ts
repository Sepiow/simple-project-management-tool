import "server-only";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { AUTH_COOKIE } from "@/features/auth/constants";

// to match Dowinnsys API
export type AuthUser = {
  user_id: string;
  email?: string;
};

type AdditionalContext = {
  Variables: {
    user: AuthUser;
  };
};


export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const session = getCookie(c, AUTH_COOKIE);

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const user: AuthUser = JSON.parse(session);
      c.set("user", user);
    } catch {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await next();
  }
);