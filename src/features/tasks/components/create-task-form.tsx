"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DottedSeparator } from "@/components/custom/dotted-separator"
import { useEffect } from "react"
import { createTaskSchema, type CreateTaskSchema } from "../schemas"
import { useCreateTask } from "../api/use-create-task"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { useProjectId } from "@/features/projects/hooks/use-project-id"
import { TaskStatus } from "../types"
import { ProjectAvatar } from "@/features/projects/components/project-avatar"

interface CreateTaskFormProps {
  onCancel?: () => void
  initialStatus?: TaskStatus
}

export const CreateTaskForm = ({
  onCancel,
  initialStatus
}: CreateTaskFormProps) => {
  const currentProjectId = useProjectId()
  const { data: projectsData } = useGetProjects()
  const { mutate, isPending } = useCreateTask()

  const projects = projectsData?.documents || []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      status: initialStatus || TaskStatus.TODO,
      projectId: currentProjectId || "",
      contents: ""
    }
  })

  const selectedStatus = watch("status")
  const selectedProjectId = watch("projectId")

  const selectedProject = projects.find(
    (p: any) => String(p.id) === String(selectedProjectId)
  )

  const onSubmit = (values: CreateTaskSchema) => {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          onCancel?.()
        }
      }
    )
  }

  useEffect(() => {
    if (initialStatus) {
      setValue("status", initialStatus)
    }
  }, [initialStatus, setValue])

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new task
        </CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!errors.name}>
            <FieldLabel>Task Name</FieldLabel>
            <Input
              {...register("name")}
              placeholder="Enter task name"
              disabled={isPending}
              aria-invalid={!!errors.name}
            />
            {errors.name?.message && (
              <FieldError>{errors.name.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!errors.projectId}>
            <FieldLabel>Project</FieldLabel>
            <Select
              value={selectedProjectId}
              onValueChange={(value) => value && setValue("projectId", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a project">
                  {selectedProject ? (
                    <div className="flex items-center gap-2">
                      <ProjectAvatar name={selectedProject.name} />
                      <span className="truncate">{selectedProject.name}</span>
                    </div>
                  ) : (
                    "Select a project"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map((project: any) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    <div className="flex items-center gap-2">
                      <ProjectAvatar name={project.name} />
                      <span className="truncate">{project.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectId?.message && (
              <FieldError>{errors.projectId.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!errors.status}>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={selectedStatus}
              onValueChange={(value) => value && setValue("status", value as TaskStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
              </SelectContent>
            </Select>
            {errors.status?.message && (
              <FieldError>{errors.status.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!errors.contents}>
            <FieldLabel>contents (Optional)</FieldLabel>
            <Input
              {...register("contents")}
              placeholder="Enter task contents"
              disabled={isPending}
              aria-invalid={!!errors.contents}
            />
            {errors.contents?.message && (
              <FieldError>{errors.contents.message}</FieldError>
            )}
          </Field>

          <div className="py-4">
            <DottedSeparator />
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              size="lg"
              variant="secondary"
              onClick={onCancel}
              disabled={isPending}
              className={onCancel ? "block" : "invisible"}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={isPending}>
              Create Task
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}