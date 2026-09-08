import { redirect } from "next/navigation"
import { getCurrent } from "@/features/auth/queries"
import { CreateProjectForm } from "@/features/projects/components/create-project-form"

export default async function ProjectCreatePage() {
  const user = await getCurrent()
  if (!user) redirect("/sign-in")

  return (
    <div className="w-full lg:max-w-xl">
      <CreateProjectForm />
    </div>
  )
}