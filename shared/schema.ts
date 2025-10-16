import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  real,
  date,
  time,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - extended for esoteric repository
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Birth data for natal charts
  birthDate: date("birth_date"),
  birthTime: time("birth_time"),
  birthLocation: varchar("birth_location"),
  birthLatitude: real("birth_latitude"),
  birthLongitude: real("birth_longitude"),
  
  // Spiritual preferences
  houseSystem: varchar("house_system").default("P"), // Placidus default
  zodiacType: varchar("zodiac_type").default("tropical"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Tarot readings table
export const readings = pgTable("readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  spreadType: varchar("spread_type").notNull(), // Celtic Cross, Three Card, etc
  question: text("question"),
  isPrivate: boolean("is_private").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  
  // Store the full reading data as JSONB for flexibility
  positions: jsonb("positions").notNull(), // Array of {position, card, orientation, interpretation}
  synthesis: text("synthesis"), // Overall reading synthesis
  tags: text("tags").array(), // Array of tags
});

export const insertReadingSchema = createInsertSchema(readings).pick({
  userId: true,
  spreadType: true,
  question: true,
  isPrivate: true,
  positions: true,
  synthesis: true,
  tags: true,
});

export type InsertReading = z.infer<typeof insertReadingSchema>;
export type Reading = typeof readings.$inferSelect;

// Astral charts table
export const charts = pgTable("charts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  chartType: varchar("chart_type").notNull(), // Natal, Transit, Solar Return, etc
  
  // Chart calculation data
  date: date("date").notNull(),
  time: time("time").notNull(),
  location: varchar("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  
  // Chart settings
  houseSystem: varchar("house_system").default("P"),
  zodiacType: varchar("zodiac_type").default("tropical"),
  
  // Store the full chart data as JSONB
  planetaryPositions: jsonb("planetary_positions"), // From Swiss Ephemeris API
  houses: jsonb("houses"), // House cusps
  aspects: jsonb("aspects"), // Aspect data
  
  isPrivate: boolean("is_private").default(true).notNull(),
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChartSchema = createInsertSchema(charts).pick({
  userId: true,
  name: true,
  chartType: true,
  date: true,
  time: true,
  location: true,
  latitude: true,
  longitude: true,
  houseSystem: true,
  zodiacType: true,
  planetaryPositions: true,
  houses: true,
  aspects: true,
  isPrivate: true,
  notes: true,
});

export type InsertChart = z.infer<typeof insertChartSchema>;
export type Chart = typeof charts.$inferSelect;