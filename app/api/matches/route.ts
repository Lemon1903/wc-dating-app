import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/api-auth";
import { getUserMatches } from "@/services/matchService";

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    // Get all matches for the user
    const matches = await getUserMatches(user.id);

    return NextResponse.json({ data: matches });
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}