import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema } from "../schemas";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test02/get_all_project`
    );
    const result = await response.json();
    return c.json({ data: result.data || [] });
  })
  .post(
    "/",
    zValidator("json", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const { name, description } = c.req.valid("json");

      // create project replace with actual backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test02/create_project`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.user_id,
            name,
            description: description || "",
          }),
        }
      );

      if (!response.ok) {
        return c.json({ error: "Failed to create workspace" }, 400);
      }

      const result = await response.json();
      return c.json({ data: result.data });
    }
  );

export default app;