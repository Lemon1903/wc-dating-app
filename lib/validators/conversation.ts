import z from "zod/v4";

export const createConversationSchema = z.object({
  otherUserId: z.string(),
});

export type CreateConversationSchema = z.infer<typeof createConversationSchema>;
