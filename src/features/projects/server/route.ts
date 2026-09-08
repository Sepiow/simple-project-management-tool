import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { sessionMiddleware } from "@/lib/session-middleware"
import { createProjectSchema,updateProjectSchema } from "../schemas"

const app = new Hono()
    // dowwin user search
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user")
    
    // use id from dowwin
    let numericUserId: number | null = null
    try {
      const membersRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test01/get_all_member`,
        { cache: "no-store" } // for updating the project tab for new accounts
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

    // fetch all projects
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test02/get_all_project`, 
      { cache: "no-store" } // for the project tab update
    )
    const result = await response.json().catch(() => null)
    const allProjects = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result)
      ? result
      : []

    // filter by projects created by THIS user 
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

 // dowwin name user tab
    .post(
    "/",
    zValidator("json", createProjectSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user")
      const { name, description } = c.req.valid("json")

      // create project
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

      //user projects to get the for new created project with the ID
      const allProjectsRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test02/get_all_project`,
        { cache: "no-store" }
      )
      const allProjectsData = await allProjectsRes.json().catch(() => null)
      const allProjects = Array.isArray(allProjectsData?.data)
        ? allProjectsData.data
        : Array.isArray(allProjectsData)
        ? allProjectsData
        : []

      // get  latest project with matching name/user
      const createdProject = allProjects
        .filter((p: any) => p.name === name)
        .slice(-1)[0] || { id: null, name }

      return c.json({ data: createdProject })
    }
  )

    // dowwin project patch/update
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("json", updateProjectSchema),
    async (c) => {
      const user = c.get("user")
      const { projectId } = c.req.param()
      const { name, description } = c.req.valid("json")

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test02/patch_project`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: Number(projectId),
            user_id: user.user_id, 
            ...(name ? { name } : {}),
            ...(description !== undefined ? { description } : {})
          })
        }
      )

      if (!response.ok) {
        return c.json({ error: "Failed to update project" }, 400)
      }

            const result = await response.json()
      return c.json({ 
        data: {
          id: Number(projectId), // for the project id
          ...(typeof result?.data === "object" ? result.data : result)
        } 
      })
    }
  )

export default app