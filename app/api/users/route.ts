import { NextRequest, NextResponse } from "next/server";

import { createUserSchema } from "@/lib/validators/user";
import { createUser, getUserByEmail } from "@/services/userService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues }, { status: 400 });
    }

    const validatedData = validationResult.data;

    // Check if email is existing
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    // Create the user
    const createdUser = await createUser(validatedData);
    return NextResponse.json({ data: createdUser });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
