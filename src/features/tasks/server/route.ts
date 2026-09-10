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
  

    // edit/update task & create_changelog
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
      // 1. Fetch existing task to compare status & provide fallbacks
      let existingTask: any = null
      try {
        const getRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/get_task?id=${taskId}`,
          { cache: "no-store" }
        )
        if (getRes.ok) {
          const getJson = await getRes.json()
          existingTask = getJson?.data ?? getJson
        }
      } catch (err) {
        console.error("Failed to fetch existing task fallback:", err)
      }
      const oldStatus = existingTask?.status || "Todo"
      const currentName = name || existingTask?.name || "Untitled Task"
      const currentContents = contents !== undefined ? contents : (existingTask?.contents || "")
      const newStatus = status || oldStatus
      // 2. Patch the task in Dowinnsys Test03
      const payload = {
        task_id: Number(taskId),
        name: currentName,
        status: newStatus,
        contents: currentContents
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
      // 3. If status changed, automatically record to Dowinnsys Test04 ChangeLog!
      if (oldStatus !== newStatus) {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test04/create_changelog`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                task_id: Number(taskId),
                old_status: oldStatus,
                new_status: newStatus,
                remark: `Status changed from ${oldStatus} to ${newStatus}`
              })
            }
          )
          console.log(`ChangeLog created for task ${taskId}: ${oldStatus} -> ${newStatus}`)
        } catch (logErr) {
          console.error("Failed to create changelog:", logErr)
        }
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
    // get changelogs for a specific task
  .get(
    "/:taskId/changelogs",
    sessionMiddleware,
    async (c) => {
      const { taskId } = c.req.param()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test04/get_all_change_log`,
        { cache: "no-store" }
      )
      if (!response.ok) {
        return c.json({ data: [] })
      }
      const result = await response.json()
      const allLogs = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : []
      // Filter logs belonging to this task
      const taskLogs = allLogs.filter(
        (log: any) => String(log.task_id || log.taskId) === String(taskId)
      )
      return c.json({ data: taskLogs })
    }
  )
export default app