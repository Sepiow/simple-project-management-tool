"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateProjectSchema, type UpdateProjectSchema } from "../schemas"
import { useUpdateProject } from "../api/use-update-project"
import { DottedSeparator } from "@/components/custom/dotted-separator"
import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface EditProjectFormProps {
  onCancel?: () => void
  initialValues: {
    id: number | string
    name: string
    description?: string
  }
}

export const EditProjectForm = ({
  onCancel,
  initialValues
}: EditProjectFormProps) => {
  const router = useRouter()
  const { mutate, isPending } = useUpdateProject()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: initialValues.name,
      description: initialValues.description || ""
    }
  })

  const onSubmit = (values: UpdateProjectSchema) => {
    mutate(
      {
        param: { projectId: String(initialValues.id) },
        json: values
      },
      {
        onSuccess: () => {
          onCancel?.()
        }
      }
    )
  }

  const handleCancel = onCancel || (() => router.push(`/projects/${initialValues.id}`))

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCancel}
          type="button"
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back
        </Button>
        <CardTitle className="text-xl font-bold">
          {initialValues.name}
        </CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!errors.name}>
            <FieldLabel>Project Name</FieldLabel>
            <Input
              {...register("name")}
              placeholder="Enter project name"
              disabled={isPending}
              aria-invalid={!!errors.name}
            />
            {errors.name?.message && (
              <FieldError>{errors.name.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!errors.description}>
            <FieldLabel>Description (Optional)</FieldLabel>
            <Input
              {...register("description")}
              placeholder="Enter project description"
              disabled={isPending}
              aria-invalid={!!errors.description}
            />
            {errors.description?.message && (
              <FieldError>{errors.description.message}</FieldError>
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
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}