"use client"

import { useRouter, useParams } from "next/navigation"
import { RiAddCircleFill } from "react-icons/ri"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { ProjectAvatar } from "@/features/projects/components/project-avatar"
import { useProjectId } from "@/features/projects/hooks/use-project-id"

import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal"

export const ProjectSwitcher = () => {
  const router = useRouter()
  const projectId = useProjectId()
  const {open} = useCreateProjectModal()
  

  const { data } = useGetProjects()

  //using base ui shadcn fix for getting the right name of the project  
  const selectedProject = data?.documents?.find(
    (project: any) => String(project.id) === String(projectId)
  )

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
          onClick={open} 
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          />
      </div>

      <Select onValueChange={onSelect} value={projectId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          {/*Select avatar pic and name*/}
          <SelectValue placeholder="No project selected">
           {selectedProject ? (
           <div className="flex justify-start items-center gap-3 font-medium">
           <ProjectAvatar name={selectedProject.name} />
           <span className="truncate">{selectedProject.name}</span>
           </div>
          ) : ( "No project selected")}
        </SelectValue>
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