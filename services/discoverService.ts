import { and, eq, ne, notInArray, sql } from "drizzle-orm";

import db from "@/lib/db";
import { userLikes } from "@/lib/db/schema/likes";
import { users } from "@/lib/db/schema/users";
import { Gender, Profile } from "@/types";

type Preferences = {
  gender: Gender;
};

export async function discoverUsers(
  currentUserId: string,
  { preferences }: { preferences?: Preferences } = {},
): Promise<Profile[]> {
  // Get all user IDs that the current user has already interacted with
  const interactedUserIds = await db.query.userLikes.findMany({
    where: eq(userLikes.fromUserId, currentUserId),
  });

  const interactedIds = interactedUserIds.map((item) => item.toUserId);

  const result = await db.query.users.findMany({
    columns: {
      password: false,
      createdAt: false,
    },
    where: and(
      interactedIds.length > 0
        ? and(ne(users.id, currentUserId), notInArray(users.id, interactedIds))
        : ne(users.id, currentUserId),
      preferences ? eq(users.gender, preferences.gender) : undefined,
    ),
    // Randomize order so reloads return a different sequence
    orderBy: sql`RANDOM()`,
  });

  return result;
}
