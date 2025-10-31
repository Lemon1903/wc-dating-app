import z from "zod/v4";

export const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, { error: "This field is required" }),
});

export type UserLoginSchema = z.infer<typeof userLoginSchema>;
