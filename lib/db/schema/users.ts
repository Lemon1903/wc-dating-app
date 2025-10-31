import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const genderEnum = t.pgEnum("gender", ["male", "female"]);

export const users = pgTable("users", {
  id: t.text("id").primaryKey(),
  email: t.varchar("email", { length: 255 }).notNull().unique(),
  name: t.varchar("name", { length: 255 }).notNull(),
  password: t.text("password").notNull(),
  birthday: t.timestamp("birthday").notNull(),
  gender: genderEnum("gender").notNull(),
  bio: t.text("bio").notNull(),
  profilePhotos: t.text("profile_photos").array().notNull(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});
