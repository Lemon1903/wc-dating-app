import z from "zod/v4";

export const editProfileSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  bio: z.string().min(10, { error: "Bio must be at least 10 characters long" }),
  profilePhotos: z.array(z.string()).min(2, { error: "At least 2 profile photos are required" }),
});
