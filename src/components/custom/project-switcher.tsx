"use client"

import { useRouter, useParams } from "next/navigation"
import { RiAddCircleFill } from "react-icons/ri"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { ProjectAvatar } from "@/features/projects/components/project-avatar"

export const ProjectSwitcher = () => {
  const router = useRouter()
  const params = useParams()
  const projectId = params?.projectId as string

  const { data } = useGetProjects()

  const onSelect = (id: string | null) => {
    if (id) {
      router.push(`/projects/${id}`)
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500 font-semibold">
          Projects
        </p>
        <RiAddCircleFill
          onClick={() => router.push("/projects/create")}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>

      <Select onValueChange={onSelect} value={projectId || null}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No project selected" />
        </SelectTrigger>
        <SelectContent>
          {data?.documents?.map((project: any) => (
            <SelectItem key={project.id} value={String(project.id)}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <ProjectAvatar name={project.name} />
                <span className="truncate">{project.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}