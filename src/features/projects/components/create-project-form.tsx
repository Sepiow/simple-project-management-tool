"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createProjectSchema, type CreateProjectSchema } from "../schemas"
import { useCreateProject } from "../api/use-create-project"
import { DottedSeparator } from "@/components/custom/dotted-separator"

interface CreateProjectFormProps {
  onCancel?: () => void
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const { mutate, isPending } = useCreateProject()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  })

  const onSubmit = (values: CreateProjectSchema) => {
    mutate(
      { json: values },
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
        <CardTitle className="text-xl font-bold">
          Create a new project
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
              onClick={onCancel}
              disabled={isPending}
              className={!onCancel ? "invisible" : ""}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={isPending}>
              Create Project
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}