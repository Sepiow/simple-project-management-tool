"use client"

import { ResponsiveModal } from "@/components/custom/responsive-modal"
import { CreateTaskForm } from "./create-task-form"
import { useCreateTaskModal } from "../hooks/use-create-task-modal"

export const CreateTaskModal = () => {
  const { isOpen, setIsOpen, close, initialStatus } = useCreateTaskModal()

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskForm onCancel={close} initialStatus={initialStatus} />
    </ResponsiveModal>
  )
}