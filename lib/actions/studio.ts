"use server"

import { db } from "@/db"
import { contentBlocks } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/**
 * Add a new content block to a lesson
 */
export async function addBlock(
    lessonId: string,
    type: "video" | "text" | "sheet_music",
    content: Record<string, unknown>
) {
    if (!lessonId || !type) {
        throw new Error("Lesson ID and type are required")
    }

    // Get the highest order number for this lesson's blocks
    const existingBlocks = await db
        .select({ order: contentBlocks.order })
        .from(contentBlocks)
        .where(eq(contentBlocks.lessonId, lessonId))
        .orderBy(contentBlocks.order)

    const nextOrder = existingBlocks.length > 0
        ? Math.max(...existingBlocks.map(b => b.order)) + 1
        : 0

    const [newBlock] = await db
        .insert(contentBlocks)
        .values({
            lessonId,
            type,
            content,
            order: nextOrder,
        })
        .returning()

    revalidatePath("/studio")
    revalidatePath("/learn")

    return newBlock
}

/**
 * Update an existing content block's content
 */
export async function updateBlock(
    blockId: string,
    content: Record<string, unknown>
) {
    if (!blockId) {
        throw new Error("Block ID is required")
    }

    const [updatedBlock] = await db
        .update(contentBlocks)
        .set({ content })
        .where(eq(contentBlocks.id, blockId))
        .returning()

    revalidatePath("/studio")
    revalidatePath("/learn")

    return updatedBlock
}

/**
 * Reorder content blocks within a lesson
 * @param lessonId - The lesson containing the blocks
 * @param blockOrder - Array of block IDs in the desired order
 */
export async function reorderBlocks(
    lessonId: string,
    blockOrder: string[]
) {
    if (!lessonId || !blockOrder || blockOrder.length === 0) {
        throw new Error("Lesson ID and block order are required")
    }

    // Update each block's order based on its position in the array
    await Promise.all(
        blockOrder.map((blockId, index) =>
            db
                .update(contentBlocks)
                .set({ order: index })
                .where(
                    and(
                        eq(contentBlocks.id, blockId),
                        eq(contentBlocks.lessonId, lessonId)
                    )
                )
        )
    )

    revalidatePath("/studio")
    revalidatePath("/learn")

    return { success: true }
}

/**
 * Delete a content block
 */
export async function deleteBlock(blockId: string) {
    if (!blockId) {
        throw new Error("Block ID is required")
    }

    await db.delete(contentBlocks).where(eq(contentBlocks.id, blockId))

    revalidatePath("/studio")
    revalidatePath("/learn")

    return { success: true }
}

/**
 * Get all blocks for a lesson
 */
export async function getBlocksForLesson(lessonId: string) {
    if (!lessonId) {
        throw new Error("Lesson ID is required")
    }

    const blocks = await db
        .select()
        .from(contentBlocks)
        .where(eq(contentBlocks.lessonId, lessonId))
        .orderBy(contentBlocks.order)

    return blocks
}
