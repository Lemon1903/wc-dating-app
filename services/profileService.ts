import { eq } from "drizzle-orm";

import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { Profile } from "@/types";

export async function getUserProfileByEmail(email: string): Promise<Profile | null> {
  const result = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      password: false,
      createdAt: false,
    },
  });

  return result || null;
}

export async function getUserProfileById(id: string): Promise<Profile | null> {
  const result = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      password: false,
      createdAt: false,
    },
  });

  return result || null;
}

export async function updateUserProfileById(
  id: string,
  updateData: Partial<Pick<Profile, "name" | "bio" | "profilePhotos">>,
): Promise<Profile | null> {
  const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning({
    id: users.id,
    email: users.email,
    name: users.name,
    birthday: users.birthday,
    bio: users.bio,
    gender: users.gender,
    profilePhotos: users.profilePhotos,
  });

  return result[0] || null;
}
