import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { dbProjects } from "@/lib/mock-db";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.valid("query");
      // TODO: Call Dowinnsys API GET /projects?workspaceId=...
      const projects = dbProjects.listByWorkspace(workspaceId);
      return c.json({ data: { documents: projects, total: projects.length } });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const { name, image, workspaceId } = c.req.valid("form");

      let imageUrl: string | undefined;
      if (image instanceof File) {
        imageUrl = URL.createObjectURL(image);
      } else if (typeof image === "string") {
        imageUrl = image;
      }

      // TODO: Call Dowinnsys API POST /projects
      const project = dbProjects.create({
        name,
        imageUrl,
        workspaceId,
      });

      return c.json({ data: project });
    }
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const { projectId } = c.req.param();
    // TODO: Call Dowinnsys API GET /projects/:id
    const project = dbProjects.getById(projectId);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ data: project });
  })
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      let imageUrl: string | undefined;
      if (image instanceof File) {
        imageUrl = URL.createObjectURL(image);
      } else if (typeof image === "string") {
        imageUrl = image;
      }

      // TODO: Call Dowinnsys API PATCH /projects/:id
      const project = dbProjects.update(projectId, {
        ...(name && { name }),
        ...(imageUrl !== undefined && { imageUrl }),
      });

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      return c.json({ data: project });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const { projectId } = c.req.param();
    // TODO: Call Dowinnsys API DELETE /projects/:id
    dbProjects.delete(projectId);
    return c.json({ data: { $id: projectId } });
  });

export default app;
