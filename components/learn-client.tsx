"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { StudentSidebar } from "@/components/student-sidebar"
import { StudentContent } from "@/components/student-content"
import { FlowBar } from "@/components/flow-bar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { CourseData } from "@/lib/data"

interface LearnClientProps {
    course: CourseData
    bunnyLibraryId: string
}

export function LearnClient({ course, bunnyLibraryId }: LearnClientProps) {
    // Find the first lesson to set as default
    const firstLesson = course.sections[0]?.lessons[0]
    const [currentLessonId, setCurrentLessonId] = useState(firstLesson?.id || "")
    const [activeTab, setActiveTab] = useState<"overview" | "sheet" | "discussion">("overview")
    const [isPiPActive, setIsPiPActive] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Find current lesson data
    const currentLesson = course.sections
        .flatMap((s) => s.lessons)
        .find((l) => l.id === currentLessonId)

    // Get flat list of all lessons for navigation
    const allLessons = course.sections.flatMap((s) => s.lessons)
    const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLessonId)
    const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null
    const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null

    // Calculate course progress
    const completedCount = 0 // TODO: Track completed lessons
    const courseProgress = Math.round((completedCount / allLessons.length) * 100)

    const handleSelectLesson = (id: string) => {
        setCurrentLessonId(id)
        setSidebarOpen(false)
    }

    // Map sections to the format expected by StudentSidebar
    const sidebarSections = course.sections.map((section) => ({
        id: section.id,
        title: section.title,
        lessons: section.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            isPublished: lesson.isPublished,
        })),
    }))

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center gap-3 p-4 border-b border-border/50 bg-sidebar sticky top-0 z-50">
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetTrigger asChild>
                        <button className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                            <Menu className="w-5 h-5 text-foreground" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-80 bg-sidebar border-r border-border/50">
                        <StudentSidebar
                            currentLessonId={currentLessonId}
                            onSelectLesson={handleSelectLesson}
                            sections={sidebarSections}
                            courseTitle={course.title}
                        />
                    </SheetContent>
                </Sheet>
                <div>
                    <p className="text-xs text-muted-foreground">{course.title}</p>
                    <p className="text-sm font-medium text-foreground">{currentLesson?.title || "Select a lesson"}</p>
                </div>
            </header>

            <div className="flex-1 md:grid md:grid-cols-[280px_1fr] overflow-hidden">
                {/* Desktop sidebar - fixed height, 100vh equivalent */}
                <div className="hidden md:block h-full overflow-hidden">
                    <StudentSidebar
                        currentLessonId={currentLessonId}
                        onSelectLesson={setCurrentLessonId}
                        sections={sidebarSections}
                        courseTitle={course.title}
                    />
                </div>

                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    <StudentContent
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        isPiPActive={isPiPActive}
                        onTogglePiP={() => setIsPiPActive(!isPiPActive)}
                        lessonTitle={currentLesson?.title || ""}
                        contentBlocks={currentLesson?.contentBlocks || []}
                        bunnyLibraryId={bunnyLibraryId}
                    />
                </div>
            </div>

            <FlowBar
                previousLesson={previousLesson?.title || null}
                courseProgress={courseProgress}
                onPrevious={() => previousLesson && setCurrentLessonId(previousLesson.id)}
                onComplete={() => nextLesson && setCurrentLessonId(nextLesson.id)}
            />
        </div>
    )
}
