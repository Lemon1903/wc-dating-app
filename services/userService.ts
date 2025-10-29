import bcrypt from "bcryptjs";

import prisma from "@/lib/db";
import { CreateUserSchema } from "@/lib/validators/user";

export async function createUser(data: CreateUserSchema) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const {
    password: _,
    createdAt: __,
    ...user
  } = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      birthday: new Date(data.birthday),
    },
  });

  return user;
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
