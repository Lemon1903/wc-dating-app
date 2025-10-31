import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

import { users } from "@/lib/db/schema/users";

export const userLikes = pgTable(
  "user_likes",
  {
    id: t.text("id").primaryKey(),
    fromUserId: t
      .text("from_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toUserId: t
      .text("to_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isLike: t.boolean("is_like").notNull(), // true = like, false = pass
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [t.uniqueIndex("unique_interaction").on(table.fromUserId, table.toUserId)],
);

export const userLikesRelations = relations(userLikes, ({ one }) => ({
  fromUser: one(users, {
    fields: [userLikes.fromUserId],
    references: [users.id],
  }),
  toUser: one(users, {
    fields: [userLikes.toUserId],
    references: [users.id],
  }),
}));
