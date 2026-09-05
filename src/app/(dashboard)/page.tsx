import { getCurrent } from "@/features/auth/actions"
import { CreateProjectForm } from "@/features/projects/components/create-project-form"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await getCurrent()
  if (!user) redirect("/sign-in")

  return (
    <div>
      <CreateProjectForm />
    </div>
  )
}