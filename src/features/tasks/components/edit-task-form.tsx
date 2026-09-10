"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DottedSeparator } from "@/components/custom/dotted-separator"
import { Badge } from "@/components/ui/badge"
import { createTaskSchema, type CreateTaskSchema } from "../schemas"
import { useUpdateTask } from "../api/use-update-task"
import { TaskStatus } from "../types"
import { HistoryIcon, Loader } from "lucide-react"
import { useGetChangelogs } from "../api/use-get-changelogs"
import { format } from "date-fns"

interface EditTaskFormProps {
  onCancel?: () => void
  initialValues: {
    id: number | string
    name: string
    status: TaskStatus
    projectId: number | string
    contents?: string
  }
}

const renderStatusBadge = (statusName?: string) => {
  if (!statusName) return <Badge variant="outline" className="text-[10px] px-1.5 py-0">Unknown</Badge>
  
  const lower = statusName.toLowerCase()
  if (lower.includes("todo")) {
    return <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-medium">Todo</Badge>
  }
  if (lower.includes("progress")) {
    return <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium bg-amber-100 text-amber-900 border-amber-300">In Progress</Badge>
  }
  if (lower.includes("done")) {
    return <Badge variant="default" className="text-[10px] px-1.5 py-0 font-medium bg-emerald-600 text-white hover:bg-emerald-700">Done</Badge>
  }
  return <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">{statusName}</Badge>
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
    values: {
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
              <div className="space-y-2 max-h-48 overflow-y-auto rounded-md border p-3 bg-neutral-50/50">
                {changelogs.map((log: any, index: number) => {
                  const oldStatus =
                    log.old_status ||
                    log.oldStatus ||
                    log.old_value ||
                    log.before_status ||
                    (typeof log.remark === "string" ? log.remark.match(/from\s+([a-zA-Z\s]+?)\s+to/i)?.[1]?.trim() : null) ||
                    "Todo"

                  const newStatus =
                    log.new_status ||
                    log.newStatus ||
                    log.new_value ||
                    log.after_status ||
                    (typeof log.remark === "string" ? log.remark.match(/to\s+([a-zA-Z\s]+)/i)?.[1]?.trim() : null) ||
                    "Updated"

                  return (
                    <div
                      key={log.id || index}
                      className="flex flex-col gap-y-1 text-xs border-b last:border-0 pb-2.5 last:pb-0"
                    >
                      <div className="flex items-center gap-x-2 flex-wrap">
                        <span className="text-muted-foreground text-[11px]">Status:</span>
                        {renderStatusBadge(oldStatus)}
                        <span className="text-muted-foreground">→</span>
                        {renderStatusBadge(newStatus)}
                      </div>
                      {log.remark && (
                        <span className="text-neutral-500 italic text-[11px] pl-1">
                          {log.remark}
                        </span>
                      )}
                      {log.created_at && (
                        <span className="text-[10px] text-muted-foreground pl-1">
                          {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No status changes recorded yet.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
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