import { db } from "@/db";
import { courses, sections, lessons, contentBlocks } from "@/db/schema";
import { eq } from "drizzle-orm";

export type ContentBlock = {
    id: string;
    type: string;
    content: Record<string, unknown>;
    order: number;
};

export type Lesson = {
    id: string;
    title: string;
    order: number;
    isPublished: boolean;
    isFreePreview: boolean;
    videoId: string | null;
    duration: number | null;
    contentBlocks: ContentBlock[];
};

export type Section = {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
};

export type CourseData = {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    published: boolean;
    sections: Section[];
};

export async function getCourseData(): Promise<CourseData | null> {
    // Fetch the first course (Piano Masterclass)
    const courseRows = await db.select().from(courses).limit(1);

    if (courseRows.length === 0) {
        return null;
    }

    const course = courseRows[0];

    // Fetch sections for this course
    const sectionRows = await db
        .select()
        .from(sections)
        .where(eq(sections.courseId, course.id))
        .orderBy(sections.order);

    // Fetch lessons for all sections
    const lessonRows = await db
        .select()
        .from(lessons)
        .where(
            eq(
                lessons.sectionId,
                sectionRows.length > 0 ? sectionRows[0].id : ""
            )
        )
        .orderBy(lessons.order);

    // For a more complete solution, fetch lessons for all sections
    const allLessonRows = await Promise.all(
        sectionRows.map((section) =>
            db
                .select()
                .from(lessons)
                .where(eq(lessons.sectionId, section.id))
                .orderBy(lessons.order)
        )
    );

    // Fetch content blocks for all lessons
    const allContentBlockRows = await Promise.all(
        allLessonRows.flat().map((lesson) =>
            db
                .select()
                .from(contentBlocks)
                .where(eq(contentBlocks.lessonId, lesson.id))
                .orderBy(contentBlocks.order)
        )
    );

    // Create a map of lesson ID to content blocks
    const lessonContentMap = new Map<string, ContentBlock[]>();
    const flatLessons = allLessonRows.flat();

    flatLessons.forEach((lesson, index) => {
        lessonContentMap.set(
            lesson.id,
            allContentBlockRows[index].map((block) => ({
                id: block.id,
                type: block.type,
                content: block.content as Record<string, unknown>,
                order: block.order,
            }))
        );
    });

    // Build the sections with nested lessons and content blocks
    const sectionsWithLessons: Section[] = sectionRows.map((section, sectionIndex) => ({
        id: section.id,
        title: section.title,
        order: section.order,
        lessons: allLessonRows[sectionIndex].map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.order,
            isPublished: lesson.isPublished ?? false,
            isFreePreview: lesson.isFreePreview ?? false,
            videoId: lesson.videoID,
            duration: lesson.duration,
            contentBlocks: lessonContentMap.get(lesson.id) ?? [],
        })),
    }));

    return {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
        published: course.published ?? false,
        sections: sectionsWithLessons,
    };
}
