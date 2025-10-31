import z from "zod/v4";

export const createInteractionSchema = z.object({
  toUser: z.string(),
  isLike: z.boolean(),
});

export type CreateInteractionSchema = z.infer<typeof createInteractionSchema>;
