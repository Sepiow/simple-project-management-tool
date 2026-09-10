import { redirect } from "next/navigation"
import { getCurrent } from "@/features/auth/queries"
import { getProject } from "@/features/projects/queries"
import { EditProjectForm } from "@/features/projects/components/edit-project-form"

export const dynamic = "force-dynamic"

interface ProjectIdSettingsPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectIdSettingsPage({
  params
}: ProjectIdSettingsPageProps) {
  const user = await getCurrent()
  if (!user) redirect("/sign-in")

  const { projectId } = await params
  const initialValues = await getProject({ projectId })

  if (!initialValues) {
    redirect(`/projects/${projectId}`)
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  )
}