"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Headphones, Music } from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  duration: number | null
  isPublished: boolean
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface StudentSidebarProps {
  currentLessonId: string
  onSelectLesson: (id: string) => void
  sections: Section[]
  courseTitle: string
  completedLessonIds?: string[]
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function StudentSidebar({
  currentLessonId,
  onSelectLesson,
  sections,
  courseTitle,
  completedLessonIds = [],
}: StudentSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => sections.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  )

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0)
  const totalDuration = sections.reduce(
    (acc, s) => acc + s.lessons.reduce((la, l) => la + (l.duration || 0), 0),
    0
  )

  return (
    <aside className="h-full border-r border-border/50 bg-sidebar flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-daw-purple" />
          <h2 className="text-sm font-medium uppercase tracking-wider text-daw-purple glow-text-purple">
            Course Content
          </h2>
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sections.map((section) => (
          <div key={section.id} className="mb-2">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary/50 transition-colors group"
            >
              {expandedSections[section.id] ? (
                <ChevronDown className="w-4 h-4 text-daw-purple" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium text-foreground">{section.title}</span>
            </button>

            {/* Lessons */}
            {expandedSections[section.id] && (
              <div className="ml-2 mt-1 space-y-1">
                {section.lessons.map((lesson) => {
                  const isCompleted = completedLessonIds.includes(lesson.id)
                  const isCurrent = currentLessonId === lesson.id

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all",
                        isCurrent
                          ? "bg-daw-purple/10 border border-daw-purple/50 glow-purple"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      {/* Completion Circle */}
                      <CompletionCircle completed={isCompleted} isCurrent={isCurrent} />

                      <div className="flex-1 text-left">
                        <span
                          className={cn(
                            "text-sm block truncate",
                            isCurrent
                              ? "text-foreground font-medium"
                              : isCompleted
                                ? "text-muted-foreground"
                                : "text-foreground/80"
                          )}
                        >
                          {lesson.title}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground/70">
                          {formatDuration(lesson.duration)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Course Info */}
      <div className="p-4 border-t border-border/50 bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-daw-purple/20 border border-daw-purple/30 flex items-center justify-center">
            <Music className="w-5 h-5 text-daw-purple" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{courseTitle}</p>
            <p className="text-xs text-muted-foreground">
              {totalLessons} lessons • {formatDuration(totalDuration)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function CompletionCircle({ completed, isCurrent }: { completed: boolean; isCurrent: boolean }) {
  return (
    <div
      className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
        completed ? "bg-daw-purple border-daw-purple" : isCurrent ? "border-daw-purple" : "border-muted-foreground/40"
      )}
    >
      {completed && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {isCurrent && !completed && <div className="w-2 h-2 rounded-full bg-daw-purple animate-pulse" />}
    </div>
  )
}

