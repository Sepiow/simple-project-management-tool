import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { sessionMiddleware } from "@/lib/session-middleware"
import { createTaskSchema, getTasksSchema } from "../schemas"
import { TaskStatus, type Task } from "../types"

const app = new Hono()

  // get tasks with filters
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", getTasksSchema),
    async (c) => {
      const { projectId, status, search } = c.req.valid("query")

      // get all tasks from dowinn API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/get_all_task`,
        { cache: "no-store" }
      )

      const result = await response.json().catch(() => null)
      const allTasks = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : []

            // format task fields from backend
      let tasks: Task[] = allTasks.map((t: any) => ({
        id: t.id,
        name: t.name || t.title || "Untitled Task",
        status: t.status as TaskStatus,
        projectId: t.project_id || t.projectId,
        description: t.contents || t.description || "", //to read description
        dueDate: t.due_date || t.dueDate || undefined,
        position: t.position || 0,
        created_at: t.created_at,
        updated_at: t.updated_at
      }))

      // filter by projectId
      if (projectId) {
        tasks = tasks.filter(
          (t) => String(t.projectId) === String(projectId)
        )
      }

      // filter by status
      if (status) {
        tasks = tasks.filter((t) => t.status === status)
      }

      // filter by search term
      if (search) {
        tasks = tasks.filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        )
      }

      return c.json({
        data: {
          documents: tasks,
          total: tasks.length
        }
      })
    }
  )

    // create task
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const { name, status, projectId, dueDate, description } = c.req.valid("json")

      // format to dowinn
      const payload = {
        project_id: Number(projectId),
        name,
        status,
        contents: description || ""
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/create_task`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Dowinnsys create_task error:", response.status, errorText)
        return c.json({ error: "Failed to create task" }, 400)
      }

      const result = await response.json()
      const createdId = result?.data?.id ?? result?.id ?? result?.data

      return c.json({
        data: {
          id: createdId,
          name,
          status,
          projectId,
          description,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
        }
      })
    }
  )  
  

  // edit/update task
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const { taskId } = c.req.param()
      const { name, status, description, dueDate } = c.req.valid("json")

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/patch_task`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: Number(taskId),
            ...(name ? { name, title: name } : {}),
            ...(status ? { status } : {}),
            ...(description !== undefined ? { description } : {})
          })
        }
      )

      if (!response.ok) {
        return c.json({ error: "Failed to update task" }, 400)
      }

      const result = await response.json()

      return c.json({
        data: {
          id: Number(taskId),
          ...(name ? { name } : {}),
          ...(status ? { status } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(dueDate ? { dueDate: new Date(dueDate).toISOString() } : {})
        }
      })
    }
  )

export default app