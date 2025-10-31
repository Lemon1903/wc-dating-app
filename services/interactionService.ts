import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";

import db from "@/lib/db";
import { userLikes } from "@/lib/db/schema/likes";

export async function createLike(
  fromUser: string,
  toUser: string,
  isLike: boolean,
): Promise<string> {
  const id = createId();

  await db.insert(userLikes).values({
    id,
    fromUserId: fromUser,
    toUserId: toUser,
    isLike,
  });

  return id;
}

export async function isMutualLike(fromUser: string, toUser: string): Promise<boolean> {
  const mutualLike = await db.query.userLikes.findFirst({
    where: and(
      eq(userLikes.fromUserId, toUser),
      eq(userLikes.toUserId, fromUser),
      eq(userLikes.isLike, true),
    ),
  });

  return !!mutualLike;
}
