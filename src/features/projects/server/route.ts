import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { sessionMiddleware } from "@/lib/session-middleware"
import { createProjectSchema } from "../schemas"

const app = new Hono()
    
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user")
    
    // 1. Find the logged-in user's numeric ID (e.g. 236)
    let numericUserId: number | null = null
    try {
      const membersRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test01/get_all_member`
      )
      const membersData = await membersRes.json()
      const allMembers = Array.isArray(membersData?.data)
        ? membersData.data
        : Array.isArray(membersData)
        ? membersData
        : []

      const found = allMembers.find(
        (m: any) => m.user_id === user.user_id
      )
      if (found) {
        numericUserId = found.id
      }
    } catch (err) {
      console.error("Could not fetch members:", err)
    }

    // 2. Fetch all projects from Dowinnsys
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test02/get_all_project`
    )
    const result = await response.json().catch(() => null)
    const allProjects = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result)
      ? result
      : []

    // 3. Filter only projects created by THIS user (by numeric ID or string user_id)
    const userProjects = allProjects.filter((project: any) => {
      return (
        project.user_id === numericUserId ||
        String(project.user_id) === String(numericUserId) ||
        project.user_id === user.user_id
      )
    })

    return c.json({
      data: {
        documents: userProjects,
        total: userProjects.length
      }
    })
  })

  .post(
    "/",
    zValidator("json", createProjectSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user")
      const { name, description } = c.req.valid("json")

      // Send the string username as required by Dowinnsys POST /test02/create_project
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test02/create_project`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.user_id,
            name,
            description: description || ""
          })
        }
      )

      if (!response.ok) {
        return c.json({ error: "Failed to create project" }, 400)
      }

      const result = await response.json()
      return c.json({ data: result?.data || result })
    }
  )

export default app