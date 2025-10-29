import { createId } from '@paralleldrive/cuid2';
import bcrypt from "bcryptjs";
import { eq } from 'drizzle-orm';

import db from '@/lib/db';
import { users } from '@/lib/db/schema';
import { CreateUserSchema } from '@/lib/validators/user';

export async function createUser(data: CreateUserSchema) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = await db
    .insert(users)
    .values({
      id: createId(),
      email: data.email,
      name: data.name,
      password: hashedPassword,
      birthday: new Date(data.birthday),
      bio: data.bio,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      birthday: users.birthday,
      bio: users.bio,
    });

  return newUser[0];
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
}
