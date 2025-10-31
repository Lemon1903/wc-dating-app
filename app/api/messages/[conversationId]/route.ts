import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/api-auth";
import { createMessageSchema } from "@/lib/validators/message";
import { createMessage, getConversationMessages } from "@/services/messageService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { conversationId } = await params;
    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const messages = await getConversationMessages(conversationId);
    return NextResponse.json({ data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { conversationId } = await params;
    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const { user } = authResult;
    const body = await request.json();

    // Validate request body
    const validated = createMessageSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues }, { status: 400 });
    }

    const createdMessage = await createMessage(conversationId, user.id, validated.data.text.trim());
    return NextResponse.json({ data: createdMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
