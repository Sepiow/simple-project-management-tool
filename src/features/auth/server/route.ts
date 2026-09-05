import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import { loginSchema, registerSchema } from "../schemas";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";



const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ data: user });
  })

  .post(
    "/login",
    zValidator("json", loginSchema),
    async (c) => {
      const { user_id, password } = c.req.valid("json");

      // connect the dowwin here remove playground later
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/testlogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, password }),
      });

      if (!response.ok) {
        return c.json({ error: "Invalid user ID or password" }, 401);
      }

      setCookie(c, AUTH_COOKIE, JSON.stringify({ user_id }), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json({ success: true });
    }
  )

  .post(
    "/register",
    zValidator("json", registerSchema),
    async (c) => {
      const { user_id, email, password } = c.req.valid("json");

      // dont forget to connect the register to dowwin
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test01/create_member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, email, password }),
      });

      if (!response.ok) {
        return c.json({ error: "Failed to create account" }, 400);
      }

      setCookie(c, AUTH_COOKIE, JSON.stringify({ user_id, email }), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json({ success: true });
    }
  )

  .post("/logout", (c) => {
    deleteCookie(c, AUTH_COOKIE);
    return c.json({ success: true });
  });

export default app;