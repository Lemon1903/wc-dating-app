import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, bio, birthday, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Birthday is now an ISO string from the client
    const birthdayDate = new Date(birthday);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        bio,
        birthday: birthdayDate,
        password, // In a real app, hash the password!
      },
    });

    // Return the created user (excluding password for security)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
