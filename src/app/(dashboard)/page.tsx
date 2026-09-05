import { getCurrent } from "@/features/auth/actions"
import { CreateProjectForm } from "@/features/projects/components/create-project-form"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await getCurrent()
  if (!user) redirect("/sign-in")

  // 🔍 Fetch user's projects
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test02/get_all_project`
  )
  const result = await response.json().catch(() => null)
  const allProjects = Array.isArray(result?.data) ? result.data : []
  const userProjects = allProjects.filter(
    (project: any) => project.user_id === user.user_id
  )

  // 🚀 If user has projects, redirect to the first one!
  if (userProjects.length > 0) {
    redirect(`/projects/${userProjects[0].id}`)
  }

  // If no projects exist yet, show the create form
  return (
    <div className="w-full max-w-xl">
      <CreateProjectForm />
    </div>
  )
}