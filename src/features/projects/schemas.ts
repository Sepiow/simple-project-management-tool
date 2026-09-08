import { z } from "zod"

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
  description: z.string().optional()
})

export type CreateProjectSchema = z.infer<typeof createProjectSchema>


export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  description: z.string().optional()
})
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>