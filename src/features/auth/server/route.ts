import {z} from "zod"
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import { loginSchema, registerSchema, updateMemberSchema } from "../schemas";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";


const app = new Hono()
  // get current logged in user
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ data: user });
  })

  // get single member by id
  .get(
    "/members/:memberId",
    sessionMiddleware,
    async (c) => {
      const { memberId } = c.req.param();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test01/get_member?id=${memberId}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        return c.json({ error: "Member not found" }, 404);
      }
      const result = await response.json();
      return c.json({ data: result?.data ?? result });
    }
  )

  // login user
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
        return c.json({ error: "Invalid user ID or password" }, 401);
      }

      // for email lookup
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
        }
    )

        return c.json({success:true})
     }
    )

  // register user
  .post(
    "/register",
    zValidator("json", registerSchema),
    async (c) => {
      const { user_id, email, password } = c.req.valid("json");

       setCookie(c, AUTH_COOKIE, JSON.stringify({ user_id,email,password }), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json({ success: true });
    }
  )

  // update user email & password
  .patch(
    "/update-member",
    sessionMiddleware,
    zValidator("json", updateMemberSchema),
    async (c) => {
      const { user_id, email, old_password, new_password } = c.req.valid("json");

      // if no new password keep current password
      const effectiveNewPassword =
        new_password && new_password.trim().length > 0
          ? new_password
          : old_password;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test01/update_member`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id,
            email,
            old_password,
            new_password: effectiveNewPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Dowinnsys update_member error:", response.status, errorText);
        return c.json({ error: errorText || "Failed to update profile. Please verify your current password." }, 400);
      }

      // update cookie with the latest email
      setCookie(c, AUTH_COOKIE, JSON.stringify({ user_id, email }), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json({ success: true, data: { user_id, email } });
    }
  )

  // logout user
  .post("/logout", (c) => {
    deleteCookie(c, AUTH_COOKIE, {
      path: "/",
    });
    return c.json({ success: true });
  });

export default app;