"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import ProfilePhotosInput from "@/components/ProfilePhotosInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { registerUser } from "@/lib/api";
import { UserRegistrationSchema, userRegistrationSchema } from "@/lib/form-schemas/register-schema";
import { useMutation } from "@tanstack/react-query";

export default function SignupPage() {
  const form = useForm({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      email: "",
      name: "",
      birthday: {
        month: "",
        day: "",
        year: "",
      },
      gender: undefined,
      bio: "",
      profilePhotos: [undefined, undefined, undefined],
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const signInMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/login");
    },
    onError: (e: any) => {
      const error = e.response.data.error;
      if (Array.isArray(error)) {
        toast.error(error[0].message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleSubmit = async (values: UserRegistrationSchema) => {
    // debugToast(values);
    signInMutation.mutate(values);
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

              {/* Gender */}
              <Controller
                name="gender"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Gender</FieldLabel>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={field.value === "male" ? "default" : "outline"}
                        onClick={() => field.onChange("male")}
                        className="flex-1"
                      >
                        Male
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "female" ? "default" : "outline"}
                        onClick={() => field.onChange("female")}
                        className="flex-1"
                      >
                        Female
                      </Button>
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
                name="profilePhotos"
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
              disabled={signInMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-lg py-2 font-semibold transition-colors"
            >
              {signInMutation.isPending ? "Creating Account..." : "Create Account"}
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
