"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DottedSeparator } from "@/components/custom/dotted-separator"
import { createTaskSchema, type CreateTaskSchema } from "../schemas"
import { useUpdateTask } from "../api/use-update-task"
import { Task, TaskStatus } from "../types"

interface EditTaskFormProps {
  onCancel?: () => void
  initialValues: Task
}

export const EditTaskForm = ({
  onCancel,
  initialValues
}: EditTaskFormProps) => {
  const { mutate, isPending } = useUpdateTask()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: initialValues.name,
      status: initialValues.status,
      projectId: String(initialValues.projectId),
      contents: initialValues.contents || ""
    }
  })

  const selectedStatus = watch("status")

  const onSubmit = (values: CreateTaskSchema) => {
    mutate(
      {
        param: { taskId: String(initialValues.id) },
        json: values
      },
      {
        onSuccess: () => {
          onCancel?.()
        }
      }
    )
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit Task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Task Name</FieldLabel>
            <Input
              id="name"
              placeholder="Enter task name"
              {...register("name")}
              disabled={isPending}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              defaultValue={selectedStatus}
              value={selectedStatus}
              onValueChange={(value) => setValue("status", value as TaskStatus)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <FieldError>{errors.status.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="contents">Contents / Description</FieldLabel>
            <Input
              id="contents"
              placeholder="Enter contents or description"
              {...register("contents")}
              disabled={isPending}
            />
            {errors.contents && (
              <FieldError>{errors.contents.message}</FieldError>
            )}
          </Field>

          <div className="py-2">
            <DottedSeparator />
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}