"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon, FolderKanban } from "lucide-react"
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal"

export const EmptyDashboard = () => {
  const { open } = useCreateProjectModal()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 border border-dashed rounded-lg bg-white shadow-xs">
      <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
        <FolderKanban className="size-6" />
      </div>
      <h2 className="text-xl font-bold text-neutral-800">No Projects Found</h2>
      <p className="text-sm text-neutral-500 mt-1 mb-6 max-w-sm">
        You don't have any projects yet. Create your first project to start managing tasks and tracking progress on the board.
      </p>
      <Button onClick={open} size="lg">
        <PlusIcon className="size-4 mr-2" />
        Create Project
      </Button>
    </div>
  )
}