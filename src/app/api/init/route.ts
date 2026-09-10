import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL
    if (!backendUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_BACKEND_API_URL is not configured" }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const targetUserId = body.user_id || "demo_user"
    const targetEmail = body.email || "demo@example.com"
    const targetPassword = body.password || "Password123!"

    // 1. Seed / Ensure Member exists
    try {
      await fetch(`${backendUrl}/test01/create_member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: targetUserId,
          email: targetEmail,
          password: targetPassword,
        }),
      })
    } catch {
      // Ignored if user already exists
    }

    // 2. Seed Projects
    const sampleProjects = [
      {
        name: "Website Redesign",
        description: "Revamp the company landing page and branding elements.",
      },
      {
        name: "Mobile App MVP",
        description: "Initial release of the iOS and Android cross-platform app.",
      },
    ]

    const createdProjects: any[] = []

    for (const proj of sampleProjects) {
      const res = await fetch(`${backendUrl}/test02/create_project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: targetUserId,
          name: proj.name,
          description: proj.description,
        }),
      })

      const projJson = await res.json().catch(() => null)
      const projId = projJson?.data?.id ?? projJson?.id ?? (typeof projJson?.data === "number" ? projJson.data : null)
      createdProjects.push({ id: projId, name: proj.name })
    }

    // Fetch created project IDs if not returned directly
    let primaryProjectId = createdProjects[0]?.id
    if (!primaryProjectId) {
      const allProjRes = await fetch(`${backendUrl}/test02/get_all_project`, { cache: "no-store" })
      const allProjJson = await allProjRes.json().catch(() => null)
      const allProjects = Array.isArray(allProjJson?.data) ? allProjJson.data : Array.isArray(allProjJson) ? allProjJson : []
      const match = allProjects.find((p: any) => p.name === sampleProjects[0].name)
      primaryProjectId = match?.id || 1
    }

    // 3. Seed Tasks
    const sampleTasks = [
      {
        name: "Design landing page wireframes",
        status: "Done",
        contents: "Create Figma mockups for hero section, features grid, and footer.",
      },
      {
        name: "Implement user authentication",
        status: "In Progress",
        contents: "Integrate login, sign up, and session cookie middleware.",
      },
      {
        name: "Setup CI/CD deployment pipeline",
        status: "Todo",
        contents: "Configure GitHub Actions and auto-deploy to Vercel.",
      },
    ]

    const createdTasks: any[] = []
    for (const t of sampleTasks) {
      const taskRes = await fetch(`${backendUrl}/test03/create_task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: Number(primaryProjectId),
          name: t.name,
          status: t.status,
          contents: t.contents,
        }),
      })

      const taskJson = await taskRes.json().catch(() => null)
      const taskId = taskJson?.data?.id ?? taskJson?.id ?? taskJson?.data
      createdTasks.push({ id: taskId, name: t.name, status: t.status })

      // 4. Seed Changelogs for tasks that have transitioned status
      if (taskId && t.status !== "Todo") {
        try {
          await fetch(`${backendUrl}/test04/create_changelog`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              task_id: Number(taskId),
              old_status: "Todo",
              new_status: t.status,
              remark: `Initial dataset: transitioned from Todo to ${t.status}`,
            }),
          })
        } catch (logErr) {
          console.error("Changelog seed error:", logErr)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully with pre-defined dataset",
      data: {
        user: { user_id: targetUserId, email: targetEmail },
        projects: createdProjects,
        tasks: createdTasks,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize dataset" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST(new Request("http://localhost/api/init", { method: "POST" }))
}