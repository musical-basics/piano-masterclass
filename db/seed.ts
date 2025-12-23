import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import { courses, sections, lessons, contentBlocks, pricingPlans } from "./schema";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
    console.log("🌱 Seeding database...");

    // Clean up existing data first
    console.log("🧹 Cleaning up existing data...");
    await db.delete(courses);

    // 1. Create Course
    const [course] = await db
        .insert(courses)
        .values({
            title: "Piano Masterclass: From Zero to Hero",
            description: "A comprehensive piano course for absolute beginners.",
            published: true,
        })
        .returning();

    console.log(`✅ Created course: ${course.title}`);

    // 2. Create Section
    const [section] = await db
        .insert(sections)
        .values({
            courseId: course.id,
            title: "Module 1: Getting Started",
            order: 0,
        })
        .returning();

    console.log(`✅ Created section: ${section.title}`);

    // 3. Create Lesson
    const [lesson] = await db
        .insert(lessons)
        .values({
            sectionId: section.id,
            title: "1.1 How to Sit at the Piano",
            order: 0,
            isPublished: true,
            isFreePreview: true,
        })
        .returning();

    console.log(`✅ Created lesson: ${lesson.title} (ID: ${lesson.id})`);

    // 4. Create Content Blocks
    const blocks = await db
        .insert(contentBlocks)
        .values([
            {
                lessonId: lesson.id,
                type: "video",
                content: { videoId: "5806a65e-42b2-430d-b191-f569a91e27ce" },
                order: 0,
            },
            {
                lessonId: lesson.id,
                type: "text",
                content: {
                    html: "<h1>Step 1: Bench Height</h1><p>Ensure your elbows are slightly above the keys.</p>",
                },
                order: 1,
            },
            {
                lessonId: lesson.id,
                type: "sheet_music",
                content: {
                    pdfUrl: "https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK",
                },
                order: 2,
            },
        ])
        .returning();

    console.log(`✅ Created ${blocks.length} content blocks`);

    // 5. Create Pricing Plans
    const plans = await db
        .insert(pricingPlans)
        .values([
            {
                courseId: course.id,
                title: "Monthly Access",
                price: 2900, // $29.00
                currency: "USD",
                features: ["Access to all lessons", "New content monthly"],
                isPopular: false,
            },
            {
                courseId: course.id,
                title: "Lifetime Membership",
                price: 19700, // $197.00
                currency: "USD",
                features: ["One-time payment", "Downloadable sheet music", "Priority Support"],
                isPopular: true,
            },
        ])
        .returning();

    console.log(`✅ Created ${plans.length} pricing plans`);

    console.log("\n🎉 Seeding complete!");
}

seed()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    });
