"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInUser } from "@/lib/api";
import { UserLoginSchema, userLoginSchema } from "@/lib/form-schemas/login-schema";

export default function LoginPage() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: (values: UserLoginSchema) => signInUser(values),
    onSuccess: (result) => {
      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        router.push("/");
      }
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  async function handleSubmit(values: UserLoginSchema) {
    signInMutation.mutate(values);
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-8 sm:px-4">
      <Card className="w-full max-w-lg shadow-lg max-sm:border-none max-sm:shadow-none">
        <div className="p-4 sm:p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <Heart className="fill-primary text-primary h-8 w-8" />
            <h1 className="text-foreground text-3xl font-bold">Connect</h1>
          </div>

          <p className="text-muted-foreground mb-8 text-center">
            Welcome back! Log in to your account
          </p>

          <form
            id="form-rhf-login"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FieldGroup className="gap-4">
              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-login-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-login-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="you@example.com"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-login-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-login-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={signInMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-lg py-2 font-semibold transition-colors"
            >
              {signInMutation.isPending ? "Logging in..." : "Log In"}
            </Button>
          </form>

          {/* Switch to Signup */}
          <p className="text-muted-foreground mt-2 text-center">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-semibold transition-colors hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
