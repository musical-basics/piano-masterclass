"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, GripVertical, Plus, Music, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  status: "draft" | "published"
  duration?: string
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
  isExpanded: boolean
}

const initialSections: Section[] = [
  {
    id: "s1",
    title: "Getting Started",
    isExpanded: true,
    lessons: [
      { id: "l1", title: "Welcome to the Studio", status: "published", duration: "4:32" },
      { id: "l2", title: "DAW Interface Overview", status: "published", duration: "8:15" },
      { id: "l3", title: "Your First Beat", status: "draft", duration: "12:48" },
    ],
  },
  {
    id: "s2",
    title: "Music Theory Essentials",
    isExpanded: true,
    lessons: [
      { id: "l4", title: "Scales & Modes", status: "published", duration: "10:24" },
      { id: "l5", title: "Chord Progressions", status: "draft", duration: "15:30" },
      { id: "l6", title: "Rhythm & Groove", status: "draft", duration: "9:45" },
    ],
  },
  {
    id: "s3",
    title: "Advanced Production",
    isExpanded: false,
    lessons: [
      { id: "l7", title: "Mixing Fundamentals", status: "draft", duration: "18:20" },
      { id: "l8", title: "Mastering Basics", status: "draft", duration: "14:55" },
    ],
  },
]

interface CurriculumSidebarProps {
  selectedLessonId: string
  onSelectLesson: (id: string) => void
}

export function CurriculumSidebar({ selectedLessonId, onSelectLesson }: CurriculumSidebarProps) {
  const [sections, setSections] = useState<Section[]>(initialSections)

  const toggleSection = (sectionId: string) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s)))
  }

  return (
    <aside className="w-72 h-full border-r border-border/50 bg-sidebar flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-daw-purple" />
          <h2 className="text-sm font-medium uppercase tracking-wider text-daw-purple glow-text-purple">Tracks</h2>
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
              <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
              {section.isExpanded ? (
                <ChevronDown className="w-4 h-4 text-daw-purple" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium text-foreground">{section.title}</span>
            </button>

            {/* Lessons */}
            {section.isExpanded && (
              <div className="ml-4 mt-1 space-y-1">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-2 rounded-md transition-all group",
                      selectedLessonId === lesson.id
                        ? "bg-daw-purple/10 border border-daw-purple/30 glow-purple"
                        : "hover:bg-secondary/50",
                    )}
                  >
                    <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
                    <Music
                      className={cn(
                        "w-3 h-3 flex-shrink-0",
                        selectedLessonId === lesson.id ? "text-daw-purple" : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs flex-1 text-left truncate",
                        selectedLessonId === lesson.id ? "text-daw-purple font-medium" : "text-muted-foreground",
                      )}
                    >
                      {lesson.title}
                    </span>
                    {lesson.duration && (
                      <span className="font-mono text-[10px] text-muted-foreground/70">{lesson.duration}</span>
                    )}
                    {/* Status Pill */}
                    <StatusPill status={lesson.status} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Section Button */}
      <div className="p-3 border-t border-border/50">
        <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md border border-dashed border-border/50 hover:border-daw-purple/50 hover:bg-daw-purple/5 transition-all text-muted-foreground hover:text-daw-purple">
          <Plus className="w-4 h-4" />
          <span className="text-xs font-medium">Add Track</span>
        </button>
      </div>
    </aside>
  )
}

function StatusPill({ status }: { status: "draft" | "published" }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide",
        status === "published" ? "bg-daw-cyan/10 text-daw-cyan" : "bg-secondary text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "published" ? "bg-daw-cyan glow-cyan animate-pulse" : "bg-muted-foreground",
        )}
      />
      {status}
    </span>
  )
}
