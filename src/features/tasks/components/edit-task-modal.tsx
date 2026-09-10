"use client"

import { ResponsiveModal } from "@/components/custom/responsive-modal"
import { EditTaskForm } from "./edit-task-form"
import { useEditTaskModal } from "../hooks/use-edit-task-modal"
import { useGetTask } from "../api/use-get-task"
import { Loader } from "lucide-react"

export const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModal()
  const { data: initialValues, isLoading } = useGetTask({ taskId: taskId || "" })

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {isLoading ? (
        <div className="w-full h-[300px] flex items-center justify-center">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : initialValues ? (
        <EditTaskForm initialValues={initialValues} onCancel={close} />
      ) : null}
    </ResponsiveModal>
  )
}