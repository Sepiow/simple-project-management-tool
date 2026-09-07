import { redirect } from "next/navigation"
import { getCurrent } from "@/features/auth/queries"

interface ProjectIdPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const user = await getCurrent()
  if (!user) redirect("/sign-in")

  const { projectId } = await params

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test02/get_project?id=${projectId}`
  )
  const result = await response.json().catch(() => null)
  const project = result?.data

  if (!project) {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-sm text-neutral-500">{project.description}</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <p className="text-neutral-500">Tasks placeholder.</p>
      </div>
    </div>
  )
}