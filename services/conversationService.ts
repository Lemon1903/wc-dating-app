import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, or } from "drizzle-orm";

import db from "@/lib/db";
import { conversations } from "@/lib/db/schema/conversations";
import { matches } from "@/lib/db/schema/matches";
import { messages } from "@/lib/db/schema/messages";
import { updateMatchStatus } from "@/services/matchService";
import { getUserProfileById } from "@/services/profileService";
import { Conversation } from "@/types";

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const userConversations = await db.query.conversations.findMany({
    where: and(
      or(eq(conversations.userAId, userId), eq(conversations.userBId, userId)),
      eq(conversations.isActive, true),
    ),
    with: {
      userA: {
        columns: {
          password: false,
          createdAt: false,
        },
      },
      userB: {
        columns: {
          password: false,
          createdAt: false,
        },
      },
      messages: {
        orderBy: [desc(messages.createdAt)],
      },
    },
  });

  return userConversations.map((conversation) => ({
    id: conversation.id,
    otherUser: conversation.userAId === userId ? conversation.userB : conversation.userA,
    messages: conversation.messages,
    isActive: conversation.isActive,
    createdAt: conversation.createdAt,
  }));
}

export async function getConversation(
  userAId: string,
  userBId: string,
): Promise<Conversation | null> {
  // Check if there's already a conversation between these users
  const existingConversation = await db.query.conversations.findFirst({
    where: and(
      or(
        and(eq(conversations.userAId, userAId), eq(conversations.userBId, userBId)),
        and(eq(conversations.userAId, userBId), eq(conversations.userBId, userAId)),
      ),
      eq(conversations.isActive, true),
    ),
    with: {
      userA: {
        columns: {
          password: false,
          createdAt: false,
        },
      },
      userB: {
        columns: {
          password: false,
          createdAt: false,
        },
      },
      messages: {
        orderBy: [desc(messages.createdAt)],
      },
    },
  });

  if (!existingConversation) {
    return null;
  }

  return {
    id: existingConversation.id,
    otherUser:
      existingConversation.userAId === userAId
        ? existingConversation.userB
        : existingConversation.userA,
    messages: existingConversation.messages,
    isActive: existingConversation.isActive,
    createdAt: existingConversation.createdAt,
  };
}

export async function createConversation(
  userId: string,
  otherUserId: string,
): Promise<Conversation> {
  // Check if there's a match between these users
  const match = await db.query.matches.findFirst({
    where: or(
      and(eq(matches.userAId, userId), eq(matches.userBId, otherUserId)),
      and(eq(matches.userAId, otherUserId), eq(matches.userBId, userId)),
    ),
  });

  if (!match) {
    throw new Error("Cannot create conversation: users are not matched");
  }

  // Get the other user profile
  const otherUser = await getUserProfileById(otherUserId);
  if (!otherUser) {
    throw new Error("Other user not found");
  }

  // Create new conversation
  const id = createId();
  const [sortedUserAId, sortedUserBId] = [userId, otherUserId].sort(); // Ensure consistent ordering

  const newConversation = await db
    .insert(conversations)
    .values({
      id,
      userAId: sortedUserAId,
      userBId: sortedUserBId,
    })
    .returning({
      id: conversations.id,
      createdAt: conversations.createdAt,
    });

  // set match status to 'success'
  await updateMatchStatus(match.id, "success");

  return {
    id,
    otherUser,
    messages: [],
    isActive: true,
    createdAt: newConversation[0].createdAt,
  };
}

export async function deactivateConversation(conversationId: string): Promise<void> {
  await db
    .update(conversations)
    .set({ isActive: false })
    .where(eq(conversations.id, conversationId));
}
