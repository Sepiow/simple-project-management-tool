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
        contents: t.contents || "", //to read contents
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

      // get single task
  .get(
    "/:taskId",
    sessionMiddleware,
    async (c) => {
      const { taskId } = c.req.param()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/get_task?id=${taskId}`,
        { cache: "no-store" }
      )

      if (!response.ok) {
        return c.json({ error: "Task not found" }, 404)
      }

      const result = await response.json()
      const t = result?.data ?? result

      return c.json({
        data: {
          id: t.id,
          name: t.name || t.title || "Untitled Task",
          status: t.status as TaskStatus,
          projectId: t.project_id || t.projectId,
          contents: t.contents || "",
          dueDate: t.due_date || t.dueDate || undefined,
          created_at: t.created_at,
          updated_at: t.updated_at
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
      const { name, status, projectId, dueDate, contents } = c.req.valid("json")

      // format to dowinn
      const payload = {
        project_id: Number(projectId),
        name,
        status,
        contents: contents || ""
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
          contents,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
        }
      })
    }
  )  
  

    // edit/update task
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial(), (result, c) => {
      if (!result.success) {
        console.error("Zod Validation Error:", result.error)
        return c.json({ error: "Invalid update data" }, 400)
      }
    }),
    async (c) => {
      const { taskId } = c.req.param()
      let { name, status, contents } = c.req.valid("json")

      // if name or contents is missing make it
      // fetch the existing task based on format
      if (!name || contents === undefined) {
        try {
          const getRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/get_task?id=${taskId}`
          )
          if (getRes.ok) {
            const getJson = await getRes.json()
            const existing = getJson?.data ?? getJson
            if (!name && existing?.name) name = existing.name
            if (contents === undefined && existing?.contents !== undefined) {
              contents = existing.contents
            }
            if (!status && existing?.status) status = existing.status
          }
        } catch (err) {
          console.error("Failed to fetch existing task fallback:", err)
        }
      }

      // make sure the format is correct
      const payload = {
        task_id: Number(taskId),
        name: name || "Untitled Task",
        status: status || "Todo",
        contents: contents ?? ""
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/patch_task`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Dowinnsys patch_task error:", response.status, errorText)
        return c.json({ error: errorText || "Failed to update task" }, 400)
      }

      return c.json({
        data: {
          id: Number(taskId),
          name: payload.name,
          status: payload.status,
          contents: payload.contents
        }
      })
    }
  )
export default app