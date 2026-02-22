import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Database Schema Definition
 *
 * Define your database tables and relationships here using Drizzle ORM.
 * This boilerplate uses expo-sqlite for local persistent storage.
 *
 * @example
 * ```typescript
 * export const items = sqliteTable("items", {
 *   id: text("id").primaryKey(),
 *   name: text("name").notNull(),
 *   createdAt: integer("created_at").notNull(),
 * });
 * ```
 */

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
