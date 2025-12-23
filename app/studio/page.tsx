import { db } from "@/db"
import { lessons, contentBlocks } from "@/db/schema"
import { eq } from "drizzle-orm"
import { StudioClient } from "@/components/studio/studio-client"
import { redirect } from "next/navigation"

interface StudioPageProps {
    searchParams: Promise<{ lessonId?: string }>
}

export default async function StudioPage({ searchParams }: StudioPageProps) {
    const params = await searchParams
    const lessonId = params.lessonId

    if (!lessonId) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">No Lesson Selected</h1>
                    <p className="text-muted-foreground mb-4">Please select a lesson from the admin panel to edit.</p>
                    <a href="/admin" className="text-daw-purple hover:underline">
                        Go to Admin Panel
                    </a>
                </div>
            </div>
        )
    }

    // Fetch the lesson
    const lesson = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, lessonId))
        .limit(1)
        .then(rows => rows[0])

    if (!lesson) {
        redirect("/admin")
    }

    // Fetch content blocks for this lesson
    const blocks = await db
        .select()
        .from(contentBlocks)
        .where(eq(contentBlocks.lessonId, lessonId))
        .orderBy(contentBlocks.order)

    const bunnyLibraryId = process.env.BUNNY_LIBRARY_ID || ""

    // Map blocks to the expected format
    const formattedBlocks = blocks.map(block => ({
        id: block.id,
        type: block.type as "text" | "video" | "sheet_music" | "audio",
        content: block.content as Record<string, unknown>,
        order: block.order,
    }))

    return (
        <StudioClient
            lessonId={lessonId}
            lessonTitle={lesson.title}
            initialBlocks={formattedBlocks}
            bunnyLibraryId={bunnyLibraryId}
        />
    )
}
