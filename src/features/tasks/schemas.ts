import { z } from "zod"
import { TaskStatus } from "./types"

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Task name is required"),
  status: z.enum([
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ], { message: "Status is required" }),
  projectId: z.string().trim().min(1, "Project is required"),
  dueDate: z.union([z.date(), z.string()]).optional(),
  contents: z.string().optional()
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>

export const getTasksSchema = z.object({
  projectId: z.string().nullish(),
  status: z.enum([
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ]).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish()
})

export type GetTasksSchema = z.infer<typeof getTasksSchema>