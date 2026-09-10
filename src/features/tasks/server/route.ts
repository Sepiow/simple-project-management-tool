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

      let tasks: Task[] = allTasks.map((t: any) => ({
        id: t.id,
        name: t.name || t.title || "Untitled Task",
        status: t.status as TaskStatus,
        projectId: t.project_id || t.projectId,
        contents: t.contents || "",
        position: t.position || 0,
        created_at: t.created_at,
        updated_at: t.updated_at
      }))

      if (projectId) {
        tasks = tasks.filter(
          (t) => String(t.projectId) === String(projectId)
        )
      }

      if (status) {
        tasks = tasks.filter((t) => t.status === status)
      }

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

  // get all changelogs for an entire project (Project History / Task Logs)
  .get(
    "/project/:projectId/changelogs",
    sessionMiddleware,
    async (c) => {
      const { projectId } = c.req.param()
      try {
        // 1. Fetch tasks for this project to map task IDs to task names
        const allTasksRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/get_all_task`,
          { cache: "no-store" }
        )
        const allTasksJson = await allTasksRes.json().catch(() => null)
        const allTasks = Array.isArray(allTasksJson?.data)
          ? allTasksJson.data
          : Array.isArray(allTasksJson)
          ? allTasksJson
          : []

        const projectTasks = allTasks.filter(
          (t: any) => String(t.project_id || t.projectId) === String(projectId)
        )

        const taskMap = new Map<string, string>()
        projectTasks.forEach((t: any) => {
          taskMap.set(String(t.id), t.name || t.title || `Task #${t.id}`)
        })

        const projectTaskIds = new Set(projectTasks.map((t: any) => String(t.id)))

        // 2. Fetch all changelogs
        const allLogsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test04/get_all_change_log`,
          { cache: "no-store" }
        )
        const allLogsJson = await allLogsRes.json().catch(() => null)
        const allLogs = Array.isArray(allLogsJson?.data)
          ? allLogsJson.data
          : Array.isArray(allLogsJson)
          ? allLogsJson
          : []

        // 3. Filter changelogs that belong to this project's tasks
        const projectLogs = allLogs
          .filter((l: any) => projectTaskIds.has(String(l.task_id || l.taskId)))
          .map((l: any) => ({
            ...l,
            task_name: taskMap.get(String(l.task_id || l.taskId)) || `Task #${l.task_id || l.taskId}`
          }))

        // 4. Sort descending (most recent first)
        projectLogs.sort((a: any, b: any) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : (Number(a.id) || 0)
          const timeB = b.created_at ? new Date(b.created_at).getTime() : (Number(b.id) || 0)
          return timeB - timeA
        })

        return c.json({ data: projectLogs })
      } catch (err) {
        console.error("Failed to fetch project changelogs:", err)
        return c.json({ data: [] })
      }
    }
  )

  // get changelogs for a single task
  .get(
    "/:taskId/changelogs",
    sessionMiddleware,
    async (c) => {
      const { taskId } = c.req.param()
      try {
        let logs: any[] = []

        const allLogsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test04/get_all_change_log`,
          { cache: "no-store" }
        )

        if (allLogsRes.ok) {
          const allLogsJson = await allLogsRes.json().catch(() => null)
          const allLogs = Array.isArray(allLogsJson?.data)
            ? allLogsJson.data
            : Array.isArray(allLogsJson)
            ? allLogsJson
            : []

          logs = allLogs.filter(
            (l: any) =>
              String(l.task_id) === String(taskId) ||
              String(l.taskId) === String(taskId)
          )
        }

        logs.sort((a: any, b: any) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : (Number(a.id) || 0)
          const timeB = b.created_at ? new Date(b.created_at).getTime() : (Number(b.id) || 0)
          return timeB - timeA
        })

        return c.json({ data: logs })
      } catch (err) {
        console.error("Failed to fetch changelogs:", err)
        return c.json({ data: [] })
      }
    }
  )

  // get single task
  .get(
    "/:taskId",
    sessionMiddleware,
    async (c) => {
      const { taskId } = c.req.param()

      let taskData: any = null

      try {
        const allTasksRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/get_all_task`,
          { cache: "no-store" }
        )
        if (allTasksRes.ok) {
          const allTasksJson = await allTasksRes.json().catch(() => null)
          const allTasks = Array.isArray(allTasksJson?.data)
            ? allTasksJson.data
            : Array.isArray(allTasksJson)
            ? allTasksJson
            : []
          taskData = allTasks.find((t: any) => String(t.id) === String(taskId))
        }
      } catch (err) {
        console.error("Could not fetch from all_task:", err)
      }

      if (!taskData) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/get_task?id=${taskId}`,
          { cache: "no-store" }
        )
        if (response.ok) {
          const result = await response.json().catch(() => null)
          taskData = result?.data ?? result
        }
      }

      if (!taskData) {
        return c.json({ error: "Task not found" }, 404)
      }

      return c.json({
        data: {
          id: taskData.id,
          name: taskData.name || taskData.title || "Untitled Task",
          status: taskData.status as TaskStatus,
          projectId: taskData.project_id || taskData.projectId,
          contents: taskData.contents || "",
          created_at: taskData.created_at,
          updated_at: taskData.updated_at
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
      const { name, status, projectId, contents } = c.req.valid("json")

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
          contents
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

      let existingTask: any = null
      try {
        const allTasksRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test03/get_all_task`,
          { cache: "no-store" }
        )
        if (allTasksRes.ok) {
          const allTasksJson = await allTasksRes.json()
          const allTasks = Array.isArray(allTasksJson?.data)
            ? allTasksJson.data
            : Array.isArray(allTasksJson)
            ? allTasksJson
            : []
          existingTask = allTasks.find(
            (t: any) => String(t.id) === String(taskId)
          )
        }
      } catch (err) {
        console.error("Failed to fetch existing tasks:", err)
      }

      if (!existingTask) {
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
          console.error("Failed to fetch get_task fallback:", err)
        }
      }

      const oldStatus = existingTask?.status || "Todo"
      const currentName = name || existingTask?.name || existingTask?.title || "Untitled Task"
      const currentContents = contents !== undefined ? contents : (existingTask?.contents || "")
      const newStatus = status || oldStatus

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

export default app