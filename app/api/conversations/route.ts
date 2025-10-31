import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/api-auth";
import { createConversationSchema } from "@/lib/validators/conversation";
import {
  createConversation,
  getConversation,
  getUserConversations,
} from "@/services/conversationService";

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const conversations = await getUserConversations(user.id);

    return NextResponse.json({ data: conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = authResult;
    const body = await request.json();

    // Validate request body
    const validation = createConversationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    }

    const { otherUserId } = validation.data;

    // Prevent creating conversation with oneself
    if (user.id === otherUserId) {
      return NextResponse.json(
        { error: "Cannot create conversation with yourself" },
        { status: 400 },
      );
    }

    // Check if conversation already exists
    const existingConversation = await getConversation(user.id, otherUserId);
    if (existingConversation) {
      return NextResponse.json({ data: existingConversation });
    }

    // Create new conversation
    const conversation = await createConversation(user.id, otherUserId);
    return NextResponse.json({ data: conversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
