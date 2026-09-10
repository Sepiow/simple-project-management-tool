"use client"

import { useRouter } from "next/navigation"
import { MoreVertical, PencilIcon, ExternalLinkIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useEditTaskModal } from "../hooks/use-edit-task-modal"

interface TaskActionsProps {
  id: string | number
  projectId?: string | number
  children?: React.ReactNode
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const router = useRouter()
  const { open } = useEditTaskModal()

  const onOpenProject = () => {
    if (projectId) {
      router.push(`/projects/${projectId}`)
    }
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="size-6 p-0 flex items-center justify-center rounded-md hover:bg-neutral-100 transition outline-none cursor-pointer">
          {children || <MoreVertical className="size-4 text-neutral-500" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-[10px] cursor-pointer"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}