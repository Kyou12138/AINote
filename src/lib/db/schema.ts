import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const $notes = pgTable("notes", {
    id: serial("id").primaryKey(),
    name: text("title").notNull(),
    imgUrl: text("imgUrl"),
    userId: text("user_id").notNull(),
    editorState: text("editor_state"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type NoteType = typeof $notes.$inferInsert;
