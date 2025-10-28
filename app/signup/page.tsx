"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod/v4";

import ProfilePhotosInput from "@/components/ProfilePhotosInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { validateBirthday } from "@/lib/date-utils";

const formSchema = z
  .object({
    email: z.email(),
    name: z.string().min(1, { message: "Name is required" }),
    birthday: z
      .object({
        month: z.string(),
        day: z.string(),
        year: z.string(),
      })
      .refine(validateBirthday, {
        message: "Please provide a valid birthday and you must be at least 18 years old",
      }),
    bio: z.string().max(10, { message: "Bio must be at most 10 characters" }),
    profileImages: z
      .array(z.instanceof(File).optional())
      .max(3)
      .refine((images) => images.filter((img) => img !== undefined).length >= 2, {
        message: "Please upload at least 2 profile pictures",
      }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      birthday: {
        month: "",
        day: "",
        year: "",
      },
      bio: "",
      profileImages: [undefined, undefined, undefined],
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    // debugToast(values);

    try {
      // Prepare the data for the API (exclude profileImages for now, as they require file upload)
      const { profileImages, confirmPassword, ...userData } = values;

      // Convert birthday object to ISO date string
      const month = parseInt(userData.birthday.month, 10);
      const day = parseInt(userData.birthday.day, 10);
      const year = parseInt(userData.birthday.year, 10);

      const apiData = {
        ...userData,
        birthday: new Date(year, month - 1, day),
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Success - redirect to login page
      toast.success("Account created successfully! Please log in.");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

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
            Create your profile and start meeting people
          </p>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FieldGroup className="gap-4">
              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-signup-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-signup-email"
                      type="email"
                      placeholder="you@example.com"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Name */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-signup-name">Full Name</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-signup-name"
                      type="text"
                      placeholder="John Doe"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Birthday */}
              <Controller
                name="birthday"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Birthday</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={field.value.month}
                        onChange={(e) => field.onChange({ ...field.value, month: e.target.value })}
                        placeholder="MM"
                        className="w-16"
                      />
                      <Input
                        type="number"
                        value={field.value.day}
                        onChange={(e) => field.onChange({ ...field.value, day: e.target.value })}
                        placeholder="DD"
                        className="w-16"
                      />
                      <Input
                        type="number"
                        value={field.value.year}
                        onChange={(e) => field.onChange({ ...field.value, year: e.target.value })}
                        placeholder="YYYY"
                        className="w-20"
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Bio */}
              <Controller
                name="bio"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-signup-bio">Bio</FieldLabel>
                    <Textarea
                      {...field}
                      id="form-rhf-signup-bio"
                      placeholder="Tell us about yourself..."
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Profile Photos */}
              <Controller
                name="profileImages"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Profile Photos</FieldLabel>
                    <ProfilePhotosInput {...field} />
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
                    <FieldLabel htmlFor="form-rhf-signup-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-signup-password"
                      type="password"
                      placeholder="••••••••"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-signup-confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-signup-confirm-password"
                      type="password"
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Switch to Login */}
          <p className="text-muted-foreground mt-2 text-center">
            Already have an account?{" "}
            <Link href="/" className="text-primary font-semibold transition-colors hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
