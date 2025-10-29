"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Heart } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod/v4";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(1, { error: "This field is required" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        router.push("/"); // Redirect to dashboard or home
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-lg py-2 font-semibold transition-colors"
            >
              {isLoading ? "Logging in..." : "Log In"}
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
