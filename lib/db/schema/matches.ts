import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

import { users } from "@/lib/db/schema/users";

export const matchStatusEnum = t.pgEnum("match_status", ["pending", "success", "inactive"]);

export const matches = pgTable(
  "matches",
  {
    id: t.text("id").primaryKey(),
    userAId: t
      .text("user_a_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userBId: t
      .text("user_b_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: matchStatusEnum("status").default("pending").notNull(),
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [t.uniqueIndex("unique_match").on(table.userAId, table.userBId)],
);

export const matchesRelations = relations(matches, ({ one }) => ({
  userA: one(users, {
    fields: [matches.userAId],
    references: [users.id],
  }),
  userB: one(users, {
    fields: [matches.userBId],
    references: [users.id],
  }),
}));
