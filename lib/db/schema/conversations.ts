import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

import { messages } from "@/lib/db/schema/messages";
import { users } from "@/lib/db/schema/users";
import { relations } from "drizzle-orm";

export const conversations = pgTable(
  "conversations",
  {
    id: t.text("id").primaryKey(),
    userAId: t
      .text("user_a_id")
      .notNull()
      .references(() => users.id),
    userBId: t
      .text("user_b_id")
      .notNull()
      .references(() => users.id),
    isActive: t.boolean("is_active").default(true).notNull(), // unmatch sets this to false
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [t.uniqueIndex("unique_conversation").on(table.userAId, table.userBId)],
);

export const conversationRelations = relations(conversations, ({ one, many }) => ({
  userA: one(users, {
    fields: [conversations.userAId],
    references: [users.id],
  }),
  userB: one(users, {
    fields: [conversations.userBId],
    references: [users.id],
  }),
  messages: many(messages),
}));
