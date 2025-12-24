import { db } from "@/db"
import { courses, sections, lessons } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { AdminClient } from "@/components/admin/admin-client"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Admin Dashboard | Course Editor",
    description: "Manage your course curriculum",
}

export default async function AdminPage() {
    // Fetch the first course (for now, assuming single course)
    const [course] = await db
        .select()
        .from(courses)
        .limit(1)

    if (!course) {
        // No course exists, could redirect to a setup page
        redirect("/")
    }

    // Fetch all sections with their lessons
    const sectionsData = await db
        .select()
        .from(sections)
        .where(eq(sections.courseId, course.id))
        .orderBy(asc(sections.order))

    // Fetch all lessons
    const lessonsData = await db
        .select()
        .from(lessons)
        .orderBy(asc(lessons.order))

    // Group lessons by section
    const sectionsWithLessons = sectionsData.map(section => ({
        ...section,
        lessons: lessonsData
            .filter(lesson => lesson.sectionId === section.id)
            .sort((a, b) => a.order - b.order),
    }))

    return (
        <AdminClient
            courseId={course.id}
            courseTitle={course.title}
            sections={sectionsWithLessons}
        />
    )
}
