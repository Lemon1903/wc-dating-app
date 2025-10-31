import { createId } from "@paralleldrive/cuid2";
import { asc, eq } from "drizzle-orm";

import db from "@/lib/db";
import { conversations } from "@/lib/db/schema/conversations";
import { messages } from "@/lib/db/schema/messages";
import { Message } from "@/types";

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const conversationMessages = await db.query.messages.findMany({
    where: eq(messages.conversationId, conversationId),
    orderBy: [asc(messages.createdAt)],
  });

  return conversationMessages.map((message) => ({
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    text: message.text,
    createdAt: message.createdAt,
  }));
}

export async function createMessage(
  conversationId: string,
  senderId: string,
  text: string,
): Promise<Message> {
  // Verify the conversation exists and is active
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  if (!conversation.isActive) {
    throw new Error("Conversation is not active");
  }

  // Verify the sender is part of the conversation
  if (conversation.userAId !== senderId && conversation.userBId !== senderId) {
    throw new Error("User is not part of this conversation");
  }

  // Create the message
  const id = createId();
  const createdMessage = await db
    .insert(messages)
    .values({
      id,
      conversationId,
      senderId,
      text,
    })
    .returning({
      id: messages.id,
      conversationId: messages.conversationId,
      senderId: messages.senderId,
      text: messages.text,
      createdAt: messages.createdAt,
    });

  return createdMessage[0];
}
