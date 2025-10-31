import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import db from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { CreateUserSchema } from "@/lib/validators/user";
import { Profile, User } from "@/types";

export async function createUser(data: CreateUserSchema): Promise<Profile> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = await db
    .insert(users)
    .values({
      id: createId(),
      ...data,
      password: hashedPassword,
      birthday: new Date(data.birthday),
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      birthday: users.birthday,
      bio: users.bio,
      gender: users.gender,
      profilePhotos: users.profilePhotos,
    });

  return newUser[0];
}

export async function getAllUsers(): Promise<User[]> {
  const result = await db.query.users.findMany();
  return result;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return result || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  return result || null;
}
