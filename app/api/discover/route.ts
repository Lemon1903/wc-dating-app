import { getAuthenticatedUser } from "@/lib/api-auth";
import { discoverUsers } from "@/services/discoverService";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/discover
 *
 * Protected route — requires an authenticated user.
 * Returns a list of "discovered" users for the authenticated user.
 *
 * @param request - NextRequest for this route
 * @returns NextResponse with:
 *   - 200 and JSON { data: users } on success,
 *   - any NextResponse returned by getAuthenticatedUser (e.g. auth/redirect/401),
 *   - 500 and JSON { error: "Internal server error" } on unexpected failures.
 *
 * @see getAuthenticatedUser
 * @see discoverUsers
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const genderPreference = user.gender === "male" ? "female" : "male";
    const users = await discoverUsers(user.id, { preferences: { gender: genderPreference } });

    return NextResponse.json({ data: users });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
