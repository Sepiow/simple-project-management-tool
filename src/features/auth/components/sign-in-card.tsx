"use client"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/custom/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import Link from "next/link";
import { loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";
import { useState } from "react";
import {Eye, EyeOff} from "lucide-react"

export const SignInCard = () => {

  const [showPassword, setShowPassword] = useState(false)
  const { mutate, isPending } = useLogin()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user_id: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({json:values});
  };

  return (
    <Card className="w-full h-full md:w-[448px] border-none shadow-none">
      <CardHeader className="flex flex-col items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <div className="px-7 mb-2">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* User ID Field */}
          <Field data-invalid={!!errors.user_id}>
            <Input
              {...register("user_id")}
              type="text"
              placeholder="Enter User ID"
              aria-invalid={!!errors.user_id}
            />
            {errors.user_id?.message && (
              <FieldError>{errors.user_id.message}</FieldError>
            )}
          </Field>

          {/* Password Field */}
          
          <Field data-invalid={!!errors.password}>
            <div className="relative w-full flex items-center">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                aria-invalid={!!errors.password}
                disabled={isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition cursor-pointer z-10"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4 shrink-0" /> : <Eye className="size-4 shrink-0" />}
              </button>
            </div>
            {errors.password?.message && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>

          <Button type="submit" size="lg" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-700 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};