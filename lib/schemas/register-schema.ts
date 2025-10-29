import z from "zod/v4";

import { validateBirthday } from "@/lib/date-utils";

export const userRegistrationSchema = z
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

export type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;
