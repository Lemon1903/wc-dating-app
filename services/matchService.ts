import { createId } from "@paralleldrive/cuid2";
import { and, eq, or } from "drizzle-orm";

import db from "@/lib/db";
import { matches } from "@/lib/db/schema/matches";
import { Match } from "@/types";

export async function getUserMatches(userId: string): Promise<Match[]> {
  const userMatches = await db.query.matches.findMany({
    where: and(
      or(eq(matches.userAId, userId), eq(matches.userBId, userId)),
      eq(matches.status, "pending"),
    ),
    with: {
      userA: {
        columns: {
          password: false,
          createdAt: false,
        },
      },
      userB: {
        columns: {
          password: false,
          createdAt: false,
        },
      },
    },
  });

  return userMatches.map((match) => ({
    id: match.id,
    otherUser: match.userAId === userId ? match.userB : match.userA,
    createdAt: match.createdAt,
  }));
}

export async function createMatch(userA: string, userB: string): Promise<string> {
  const id = createId();
  const [userAId, userBId] = [userA, userB].sort(); // Ensure consistent ordering

  await db.insert(matches).values({
    id,
    userAId,
    userBId,
  });

  return id;
}

export async function updateMatchStatus(
  matchId: string,
  status: "pending" | "success" | "inactive",
): Promise<void> {
  await db.update(matches).set({ status }).where(eq(matches.id, matchId));
}
