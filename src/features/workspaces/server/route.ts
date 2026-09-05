import { zValidator } from "@hono/zod-validator"
import { Hono  } from "hono"
import { createWorkspaceSchema } from "../schemas"
import { sessionMiddleware } from "@/lib/session-middleware"

const app = new Hono()
    .post(
       "/",
       zValidator("json", createWorkspaceSchema),
       sessionMiddleware,
       async (c) => {

       }
    )

export default app