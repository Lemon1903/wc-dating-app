import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: text("password").notNull(),
  birthday: timestamp("birthday").notNull(),
  bio: text("bio").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
