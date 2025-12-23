"use server"

import { db } from "@/db"
import { sections, lessons } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/**
 * Create a new module (section) for a course
 */
export async function createModule(courseId: string, title: string) {
    if (!courseId || !title) {
        throw new Error("Course ID and title are required")
    }

    // Get the highest order number for this course's sections
    const existingSections = await db
        .select({ order: sections.order })
        .from(sections)
        .where(eq(sections.courseId, courseId))
        .orderBy(sections.order)

    const nextOrder = existingSections.length > 0
        ? Math.max(...existingSections.map(s => s.order)) + 1
        : 0

    const [newSection] = await db
        .insert(sections)
        .values({
            courseId,
            title,
            order: nextOrder,
        })
        .returning()

    revalidatePath("/admin")
    revalidatePath("/")

    return newSection
}

/**
 * Create a new lesson within a module (section)
 */
export async function createLesson(sectionId: string, title: string) {
    if (!sectionId || !title) {
        throw new Error("Section ID and title are required")
    }

    // Get the highest order number for this section's lessons
    const existingLessons = await db
        .select({ order: lessons.order })
        .from(lessons)
        .where(eq(lessons.sectionId, sectionId))
        .orderBy(lessons.order)

    const nextOrder = existingLessons.length > 0
        ? Math.max(...existingLessons.map(l => l.order)) + 1
        : 0

    const [newLesson] = await db
        .insert(lessons)
        .values({
            sectionId,
            title,
            order: nextOrder,
            isPublished: false,
            isFreePreview: false,
        })
        .returning()

    revalidatePath("/admin")
    revalidatePath("/learn")

    return newLesson
}

/**
 * Update a lesson's properties
 */
export async function updateLesson(
    lessonId: string,
    data: {
        title?: string
        videoId?: string | null
        isPublished?: boolean
        isFreePreview?: boolean
        duration?: number | null
    }
) {
    if (!lessonId) {
        throw new Error("Lesson ID is required")
    }

    const [updatedLesson] = await db
        .update(lessons)
        .set({
            ...(data.title !== undefined && { title: data.title }),
            ...(data.videoId !== undefined && { videoID: data.videoId }),
            ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
            ...(data.isFreePreview !== undefined && { isFreePreview: data.isFreePreview }),
            ...(data.duration !== undefined && { duration: data.duration }),
        })
        .where(eq(lessons.id, lessonId))
        .returning()

    revalidatePath("/admin")
    revalidatePath("/learn")

    return updatedLesson
}

/**
 * Delete a lesson
 */
export async function deleteLesson(lessonId: string) {
    if (!lessonId) {
        throw new Error("Lesson ID is required")
    }

    await db.delete(lessons).where(eq(lessons.id, lessonId))

    revalidatePath("/admin")
    revalidatePath("/learn")

    return { success: true }
}

/**
 * Delete a module (section) and all its lessons
 */
export async function deleteModule(sectionId: string) {
    if (!sectionId) {
        throw new Error("Section ID is required")
    }

    // Cascade delete will handle lessons due to FK constraint
    await db.delete(sections).where(eq(sections.id, sectionId))

    revalidatePath("/admin")
    revalidatePath("/")

    return { success: true }
}

/**
 * Update a module's title
 */
export async function updateModule(sectionId: string, title: string) {
    if (!sectionId || !title) {
        throw new Error("Section ID and title are required")
    }

    const [updatedSection] = await db
        .update(sections)
        .set({ title })
        .where(eq(sections.id, sectionId))
        .returning()

    revalidatePath("/admin")
    revalidatePath("/")

    return updatedSection
}
