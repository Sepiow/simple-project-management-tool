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
import { useGetChangelogs } from "../api/use-get-changelogs"
import { HistoryIcon, Loader } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"


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

    // for getting change logs 
  const { data: changelogs, isLoading: isLoadingLogs } = useGetChangelogs({
    taskId: String(initialValues.id)
  })

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
        
            {/* Change Log Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-x-2 text-sm font-semibold text-neutral-700">
              <HistoryIcon className="size-4" />
              <span>Change History</span>
            </div>

            {isLoadingLogs ? (
              <div className="flex items-center justify-center p-4">
                <Loader className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : changelogs && changelogs.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto rounded-md border p-3 bg-neutral-50/50">
                {changelogs.map((log: any, index: number) => (
                  <div
                    key={log.id || index}
                    className="flex flex-col gap-y-1 text-xs border-b last:border-0 pb-2 last:pb-0"
                  >
                    <div className="flex items-center gap-x-1.5 flex-wrap">
                      <span className="text-muted-foreground">Status changed:</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {log.old_status || log.oldStatus}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="default" className="text-[10px] px-1.5 py-0">
                        {log.new_status || log.newStatus}
                      </Badge>
                    </div>
                    {log.remark && (
                      <span className="text-neutral-500 italic text-[11px]">
                        {log.remark}
                      </span>
                    )}
                    {log.created_at && (
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No status changes recorded yet.
              </p>
            )}
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