import z from "zod/v4";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, { error: "This field is required" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1, { error: "Name is required" }),
  bio: z.string().min(10, { error: "Bio must be at least 10 characters long" }),
  birthday: z.string().refine(
    (dateStr) => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date format" },
  ),
  password: z.string().min(6, { error: "Password must be at least 6 characters long" }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
