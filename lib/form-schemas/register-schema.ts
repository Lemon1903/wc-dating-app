import z from "zod/v4";

import { validateBirthday } from "@/lib/date-utils";

export const userRegistrationSchema = z
  .object({
    email: z.email(),
    name: z.string().min(1, { error: "Name is required" }),
    birthday: z
      .object({
        month: z.string(),
        day: z.string(),
        year: z.string(),
      })
      .refine(validateBirthday, {
        error: "Please provide a valid birthday and you must be at least 18 years old",
      }),
    bio: z.string().min(10, { error: "Bio must be at least 10 characters" }),
    profilePhotos: z
      .array(z.instanceof(File).optional())
      .max(3)
      .refine((images) => images.filter((img) => img !== undefined).length >= 2, {
        error: "Please upload at least 2 profile pictures",
      }),
    password: z.string().min(6, { error: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { error: "Please confirm your password" }),
    gender: z.enum(["male", "female"], { error: "Please select a gender" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;
