import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/api-auth";
import { createInteractionSchema } from "@/lib/validators/like";
import { createLike, isMutualLike } from "@/services/interactionService";
import { createMatch } from "@/services/matchService";

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await request.json();

    // Validate the request body
    const validationResult = createInteractionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues }, { status: 400 });
    }

    const { toUser, isLike } = validationResult.data;

    // Prevent self-interaction
    if (user.id === toUser) {
      return NextResponse.json({ error: "Cannot interact with yourself" }, { status: 400 });
    }

    const likeId = await createLike(user.id, toUser, isLike);

    // Check for mutual like and create match if applicable
    let matchId = null;
    if (isLike) {
      const isMutual = await isMutualLike(user.id, toUser);
      if (isMutual) {
        matchId = await createMatch(user.id, toUser);
      }
    }

    return NextResponse.json({ data: { likeId, matchId } }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating interaction:", error);

    // Unique violation
    if (error.code === "23505") {
      return NextResponse.json({ error: "Interaction already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
