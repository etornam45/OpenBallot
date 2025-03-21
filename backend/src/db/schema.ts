import { relations } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  voter_id: int().notNull().unique(),
//   passkey: text().notNull(),
  facial_hash: text().notNull(),
  address: text()
});


export const election = sqliteTable('elections', {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    description: text().notNull(),
    start_time: integer({
        mode: "timestamp"
    }).notNull(),
    end_time: integer({
        mode: "timestamp"
    }).notNull(),
    status: text().notNull()
})

export const electionRelations = relations(users, ({ one, many }) => ({
	pal_candidates: many(pal_candidates),
    pres_candidates: many(pres_candidates)
}));

export const constituency = sqliteTable("constituency", {
    id: int().primaryKey({ autoIncrement: true }),
    region: text().notNull(),
    name: text().notNull()
})

export const pres_candidates = sqliteTable("pres_candidates", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    political_party: text().notNull(),
    election_id: int().notNull().references(() => election.id)
})

export const pal_candidates = sqliteTable("pal_candidates", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    political_party: text().notNull(),
    election_id: int().notNull().references(() => election.id),
    // constituency_id: int().notNull().references(() => constituency.id)
})
