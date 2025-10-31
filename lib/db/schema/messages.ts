import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

import { conversations } from "@/lib/db/schema/conversations";
import { users } from "@/lib/db/schema/users";

export const messages = pgTable("messages", {
  id: t.text("id").primaryKey(),
  conversationId: t
    .text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderId: t
    .text("sender_id")
    .notNull()
    .references(() => users.id),
  text: t.text("text").notNull(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

export const messageRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));
