import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrent } from "@/features/auth/queries"
import { getProject } from "@/features/projects/queries"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"

import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher"

export const dynamic = "force-dynamic"

interface ProjectIdPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const user = await getCurrent()
  if (!user) redirect("/sign-in")

  const { projectId } = await params
  const project = await getProject({ projectId })

  if (!project) {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-sm text-neutral-500">{project.description}</p>
        </div>

        <Link href={`/projects/${projectId}/settings`}>
          <Button variant="secondary" size="sm">
            <PencilIcon className="size-4 mr-2" />
            Edit Project
          </Button>
        </Link>
      </div>

      <TaskViewSwitcher /> 
    </div>
  )
}