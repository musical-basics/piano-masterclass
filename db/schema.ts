import { pgTable, text, uuid, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

// 1. COURSES
export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. SECTIONS (Modules)
export const sections = pgTable("sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
});

// 3. LESSONS
export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionId: uuid("section_id").references(() => sections.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
  isPublished: boolean("is_published").default(false),
  isFreePreview: boolean("is_free_preview").default(false),
  videoID: text("video_id"), // Stores the Bunny.net Video ID
  duration: integer("duration"), // in seconds
});

// 4. CONTENT BLOCKS (The core of the Lesson Editor)
export const contentBlocks = pgTable("content_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  type: text("type").notNull(), // 'text', 'sheet_music', 'audio_clip'
  content: jsonb("content").notNull(),
  order: integer("order").notNull().default(0),
});

// 5. PRICING PLANS
export const pricingPlans = pgTable("pricing_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  price: integer("price").notNull(), // Store in cents (e.g., 4900 = $49.00)
  currency: text("currency").default("USD").notNull(),
  features: jsonb("features").notNull(), // Array of feature strings
  isPopular: boolean("is_popular").default(false),
});
