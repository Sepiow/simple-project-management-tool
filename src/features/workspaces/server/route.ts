import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { dbWorkspaces, dbMembers } from "@/lib/mock-db";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    // TODO: Call Dowinnsys API GET /workspaces
    const workspaces = dbWorkspaces.list(user.user_id);
    return c.json({ data: { documents: workspaces, total: workspaces.length } });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const { name, image } = c.req.valid("form");

      let imageUrl: string | undefined;
      if (image instanceof File) {
        // TODO: Upload image to Dowinnsys / storage
        imageUrl = URL.createObjectURL(image);
      } else if (typeof image === "string") {
        imageUrl = image;
      }

      // TODO: Call Dowinnsys API POST /workspaces
      const workspace = dbWorkspaces.create({
        name,
        imageUrl,
        userId: user.user_id,
      });

      return c.json({ data: workspace });
    }
  )
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    // TODO: Call Dowinnsys API GET /workspaces/:id
    const workspace = dbWorkspaces.getById(workspaceId);

    if (!workspace) {
      return c.json({ error: "Workspace not found" }, 404);
    }

    return c.json({ data: workspace });
  })
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      let imageUrl: string | undefined;
      if (image instanceof File) {
        imageUrl = URL.createObjectURL(image);
      } else if (typeof image === "string") {
        imageUrl = image;
      }

      // TODO: Call Dowinnsys API PATCH /workspaces/:id
      const workspace = dbWorkspaces.update(workspaceId, {
        ...(name && { name }),
        ...(imageUrl !== undefined && { imageUrl }),
      });

      if (!workspace) {
        return c.json({ error: "Workspace not found" }, 404);
      }

      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    // TODO: Call Dowinnsys API DELETE /workspaces/:id
    dbWorkspaces.delete(workspaceId);
    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    // TODO: Call Dowinnsys API POST /workspaces/:id/reset-invite-code
    const workspace = dbWorkspaces.resetInviteCode(workspaceId);

    if (!workspace) {
      return c.json({ error: "Workspace not found" }, 404);
    }

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");
      const user = c.get("user");

      const workspace = dbWorkspaces.getById(workspaceId);
      if (!workspace || workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      // TODO: Call Dowinnsys API POST /workspaces/:id/members
      dbMembers.add(workspaceId, user.user_id, "MEMBER");

      return c.json({ data: workspace });
    }
  );

export default app;
