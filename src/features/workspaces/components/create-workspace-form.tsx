"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createWorkspaceSchema, type CreateWorkspaceSchema } from "../schemas";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { DottedSeparator } from "@/components/custom/dotted-separator";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const { mutate, isPending } = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: CreateWorkspaceSchema) => {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Workspace Name Field */}
          <Field data-invalid={!!errors.name}>
            <FieldLabel>Workspace Name</FieldLabel>
            <Input
              {...register("name")}
              placeholder="Enter workspace name"
              disabled={isPending}
              aria-invalid={!!errors.name}
            />
            {errors.name?.message && (
              <FieldError>{errors.name.message}</FieldError>
            )}
          </Field>

          {/* Description Field */}
          <Field data-invalid={!!errors.description}>
            <FieldLabel>Description (Optional)</FieldLabel>
            <Input
              {...register("description")}
              placeholder="Enter workspace description"
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
              Create Workspace
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};