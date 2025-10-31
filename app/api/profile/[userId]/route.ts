import { NextRequest, NextResponse } from "next/server";

import { editProfileSchema } from "@/lib/validators/profile";
import { getUserProfileById, updateUserProfileById } from "@/services/profileService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    // For missing parameters
    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    // Fetch the profile
    const profile = await getUserProfileById(userId);

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: profile });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    // For missing parameters
    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    const body = await request.json();

    const validated = editProfileSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues }, { status: 400 });
    }

    // Update the profile
    const updatedProfile = await updateUserProfileById(userId, validated.data);
    if (!updatedProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updatedProfile });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
