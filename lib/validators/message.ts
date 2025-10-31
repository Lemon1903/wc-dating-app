import z from "zod/v4";

export const createMessageSchema = z.object({
  text: z.string().min(1).max(1000),
});

export type CreateMessageSchema = z.infer<typeof createMessageSchema>;
