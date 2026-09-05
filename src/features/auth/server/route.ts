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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/testlogin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, password }),
        }
      );

      const result = await response.json().catch(() => null);

      
      if (!response.ok || result?.data === "Invalid Credential") {
        return c.json({ error: "Invalid user ID or password" }, 401)
        }

        // for Email design 
        let email = "";
      try {
        const membersRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test01/get_all_member`
        );
        const membersData = await membersRes.json();
        if (Array.isArray(membersData?.data)) {
          const found = membersData.data.find((m: any) => m.user_id === user_id);
          if (found?.email) {
            email = found.email;
          }
        }
      } catch (error) {
        console.error("Could not fetch user email:", error);
      }
      
      setCookie(c, AUTH_COOKIE, JSON.stringify({ user_id, ...(email ? { email } : {}) }), {
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test01/create_member`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, email, password }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result) {
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
    deleteCookie(c, AUTH_COOKIE, {
      path: "/",
    });
    return c.json({ success: true });
  });

export default app;