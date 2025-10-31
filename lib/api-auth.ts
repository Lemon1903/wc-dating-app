import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getUserByEmail } from "@/services/userService";

export async function getAuthenticatedUser(request: NextRequest) {
  const session = await auth();
  if (!session?.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await getUserByEmail(session.user.email);
  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return { user: currentUser };
}
