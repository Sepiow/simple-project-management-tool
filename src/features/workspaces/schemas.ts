import {z} from "zod"

export const createWorkspaceSchema = z.object({
    user_id: z.string().trim().min(1,"Required"),


})

