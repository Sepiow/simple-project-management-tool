"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/custom/dotted-separator";
import { updateMemberSchema, type UpdateMemberSchema } from "../schemas";
import { useUpdateMember } from "../api/use-update-member";
import { useCurrent } from "../api/use-current";
import { Loader } from "lucide-react";

export const EditProfileCard = () => {
  const { data: user, isLoading: isLoadingUser } = useCurrent();
  const { mutate, isPending } = useUpdateMember();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateMemberSchema>({
    resolver: zodResolver(updateMemberSchema),
    values: {
      user_id: user?.user_id || "",
      email: user?.email || "",
      old_password: "",
      new_password: "",
    },
  });

  const onSubmit = (values: UpdateMemberSchema) => {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          reset({
            user_id: values.user_id,
            email: values.email,
            old_password: "",
            new_password: "",
          });
        },
      }
    );
  };

  if (isLoadingUser) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Profile & Password Settings</CardTitle>
        <CardDescription>
          Update your registered email or change your account password.
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="user_id">User ID</FieldLabel>
            <Input
              id="user_id"
              {...register("user_id")}
              disabled
              className="bg-neutral-100 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">User ID cannot be changed.</p>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              disabled={isPending}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <div className="py-2">
            <DottedSeparator />
          </div>

          <Field>
            <FieldLabel htmlFor="old_password">Current Password</FieldLabel>
            <Input
              id="old_password"
              type="password"
              placeholder="Enter your current password"
              {...register("old_password")}
              disabled={isPending}
            />
            {errors.old_password && <FieldError>{errors.old_password.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="new_password">New Password</FieldLabel>
            <Input
              id="new_password"
              type="password"
              placeholder="Enter your new password (minimum 8 characters)"
              {...register("new_password")}
              disabled={isPending}
            />
            {errors.new_password && <FieldError>{errors.new_password.message}</FieldError>}
          </Field>

          <div className="py-2">
            <DottedSeparator />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};