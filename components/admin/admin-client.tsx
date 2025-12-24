"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Plus,
    ChevronDown,
    ChevronRight,
    Pencil,
    Trash2,
    FolderPlus,
    FileVideo,
    GripVertical,
    ExternalLink,
    Loader2,
    BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createModule, createLesson, deleteLesson, deleteModule, updateModule, updateLesson } from "@/lib/actions"

interface Lesson {
    id: string
    title: string
    order: number
    isPublished: boolean
    isFreePreview: boolean
}

interface Section {
    id: string
    title: string
    order: number
    lessons: Lesson[]
}

interface AdminClientProps {
    courseId: string
    courseTitle: string
    sections: Section[]
}

export function AdminClient({ courseId, courseTitle, sections }: AdminClientProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(sections.map(s => s.id))
    )
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
    const [newModuleTitle, setNewModuleTitle] = useState("")
    const [newLessonTitle, setNewLessonTitle] = useState("")
    const [addingModuleOpen, setAddingModuleOpen] = useState(false)
    const [addingLessonToSection, setAddingLessonToSection] = useState<string | null>(null)

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections)
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId)
        } else {
            newExpanded.add(sectionId)
        }
        setExpandedSections(newExpanded)
    }

    const handleCreateModule = async () => {
        if (!newModuleTitle.trim()) return

        startTransition(async () => {
            await createModule(courseId, newModuleTitle.trim())
            setNewModuleTitle("")
            setAddingModuleOpen(false)
            router.refresh()
        })
    }

    const handleCreateLesson = async (sectionId: string) => {
        if (!newLessonTitle.trim()) return

        startTransition(async () => {
            await createLesson(sectionId, newLessonTitle.trim())
            setNewLessonTitle("")
            setAddingLessonToSection(null)
            router.refresh()
        })
    }

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm("Are you sure you want to delete this lesson?")) return

        startTransition(async () => {
            await deleteLesson(lessonId)
            router.refresh()
        })
    }

    const handleDeleteModule = async (sectionId: string) => {
        if (!confirm("Are you sure you want to delete this module and all its lessons?")) return

        startTransition(async () => {
            await deleteModule(sectionId)
            router.refresh()
        })
    }

    const handleUpdateModuleTitle = async (sectionId: string, title: string) => {
        if (!title.trim()) return

        startTransition(async () => {
            await updateModule(sectionId, title.trim())
            setEditingModuleId(null)
            router.refresh()
        })
    }

    const handleUpdateLessonTitle = async (lessonId: string, title: string) => {
        if (!title.trim()) return

        startTransition(async () => {
            await updateLesson(lessonId, { title: title.trim() })
            setEditingLessonId(null)
            router.refresh()
        })
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-daw-purple/20 border border-daw-purple/30 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-daw-purple" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">{courseTitle}</h1>
                            <p className="text-xs text-muted-foreground">Course Admin Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/learn">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Preview Course
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="space-y-4">
                    {/* Sections List */}
                    {sections.map((section, sectionIndex) => (
                        <div
                            key={section.id}
                            className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden"
                        >
                            {/* Section Header */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-secondary/30 border-b border-border/30">
                                <button className="p-1 text-muted-foreground/50 hover:text-muted-foreground cursor-grab">
                                    <GripVertical className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {expandedSections.has(section.id) ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </button>

                                <div className="w-8 h-8 rounded-lg bg-daw-purple/20 border border-daw-purple/30 flex items-center justify-center text-sm font-medium text-daw-purple">
                                    {sectionIndex + 1}
                                </div>

                                {editingModuleId === section.id ? (
                                    <input
                                        type="text"
                                        defaultValue={section.title}
                                        autoFocus
                                        onBlur={(e) => handleUpdateModuleTitle(section.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUpdateModuleTitle(section.id, e.currentTarget.value)
                                            } else if (e.key === "Escape") {
                                                setEditingModuleId(null)
                                            }
                                        }}
                                        className="flex-1 bg-transparent border-b border-daw-purple focus:outline-none text-foreground font-medium"
                                    />
                                ) : (
                                    <span className="flex-1 text-foreground font-medium">{section.title}</span>
                                )}

                                <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                                    {section.lessons.length} lesson{section.lessons.length !== 1 ? "s" : ""}
                                </span>

                                <button
                                    onClick={() => setEditingModuleId(section.id)}
                                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleDeleteModule(section.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Lessons List */}
                            {expandedSections.has(section.id) && (
                                <div className="divide-y divide-border/30">
                                    {section.lessons.map((lesson, lessonIndex) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors group"
                                        >
                                            <button className="p-1 text-muted-foreground/30 group-hover:text-muted-foreground/50 cursor-grab">
                                                <GripVertical className="w-4 h-4" />
                                            </button>

                                            <div className="w-6 h-6 rounded bg-secondary/50 flex items-center justify-center text-xs text-muted-foreground">
                                                {lessonIndex + 1}
                                            </div>

                                            <FileVideo className="w-4 h-4 text-daw-cyan" />

                                            {editingLessonId === lesson.id ? (
                                                <input
                                                    type="text"
                                                    defaultValue={lesson.title}
                                                    autoFocus
                                                    onBlur={(e) => handleUpdateLessonTitle(lesson.id, e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleUpdateLessonTitle(lesson.id, e.currentTarget.value)
                                                        } else if (e.key === "Escape") {
                                                            setEditingLessonId(null)
                                                        }
                                                    }}
                                                    className="flex-1 bg-transparent border-b border-daw-cyan focus:outline-none text-foreground text-sm"
                                                />
                                            ) : (
                                                <span className="flex-1 text-foreground text-sm">{lesson.title}</span>
                                            )}

                                            {lesson.isPublished && (
                                                <span className="text-[10px] font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                                                    Published
                                                </span>
                                            )}

                                            {lesson.isFreePreview && (
                                                <span className="text-[10px] font-medium text-daw-cyan bg-daw-cyan/10 px-1.5 py-0.5 rounded">
                                                    Free Preview
                                                </span>
                                            )}

                                            <button
                                                onClick={() => setEditingLessonId(lesson.id)}
                                                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteLesson(lesson.id)}
                                                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>

                                            <Link href={`/studio?lessonId=${lesson.id}`}>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-xs gap-1.5 border-daw-purple/30 text-daw-purple hover:bg-daw-purple/10 hover:border-daw-purple/50"
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                    Open Studio
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}

                                    {/* Add Lesson Form */}
                                    {addingLessonToSection === section.id ? (
                                        <div className="flex items-center gap-3 px-4 py-3 bg-daw-cyan/5">
                                            <div className="w-6 h-6" />
                                            <div className="w-6 h-6 rounded bg-daw-cyan/20 flex items-center justify-center">
                                                <Plus className="w-3 h-3 text-daw-cyan" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Enter lesson title..."
                                                value={newLessonTitle}
                                                onChange={(e) => setNewLessonTitle(e.target.value)}
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleCreateLesson(section.id)
                                                    } else if (e.key === "Escape") {
                                                        setAddingLessonToSection(null)
                                                        setNewLessonTitle("")
                                                    }
                                                }}
                                                className="flex-1 bg-transparent border-b border-daw-cyan/50 focus:border-daw-cyan focus:outline-none text-foreground text-sm placeholder:text-muted-foreground/50"
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleCreateLesson(section.id)}
                                                disabled={isPending || !newLessonTitle.trim()}
                                                className="h-7 text-xs bg-daw-cyan hover:bg-daw-cyan/90"
                                            >
                                                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setAddingLessonToSection(null)
                                                    setNewLessonTitle("")
                                                }}
                                                className="h-7 text-xs"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setAddingLessonToSection(section.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-daw-cyan hover:bg-daw-cyan/5 transition-colors text-sm"
                                        >
                                            <div className="w-6 h-6" />
                                            <Plus className="w-4 h-4" />
                                            Add Lesson
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add Module Form */}
                    {addingModuleOpen ? (
                        <div className="rounded-xl border border-daw-purple/30 bg-daw-purple/5 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-daw-purple/20 border border-daw-purple/30 flex items-center justify-center">
                                    <FolderPlus className="w-4 h-4 text-daw-purple" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter module title..."
                                    value={newModuleTitle}
                                    onChange={(e) => setNewModuleTitle(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleCreateModule()
                                        } else if (e.key === "Escape") {
                                            setAddingModuleOpen(false)
                                            setNewModuleTitle("")
                                        }
                                    }}
                                    className="flex-1 bg-transparent border-b border-daw-purple/50 focus:border-daw-purple focus:outline-none text-foreground font-medium placeholder:text-muted-foreground/50"
                                />
                                <Button
                                    size="sm"
                                    onClick={handleCreateModule}
                                    disabled={isPending || !newModuleTitle.trim()}
                                    className="bg-daw-purple hover:bg-daw-purple/90"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Module"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setAddingModuleOpen(false)
                                        setNewModuleTitle("")
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAddingModuleOpen(true)}
                            className="w-full rounded-xl border-2 border-dashed border-border/50 hover:border-daw-purple/50 py-6 flex items-center justify-center gap-2 text-muted-foreground hover:text-daw-purple transition-colors"
                        >
                            <FolderPlus className="w-5 h-5" />
                            <span className="font-medium">Add New Module</span>
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {sections.length === 0 && !addingModuleOpen && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">No modules yet</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Start building your course by adding your first module.
                        </p>
                        <Button onClick={() => setAddingModuleOpen(true)} className="gap-2 bg-daw-purple hover:bg-daw-purple/90">
                            <FolderPlus className="w-4 h-4" />
                            Create First Module
                        </Button>
                    </div>
                )}
            </main>
        </div>
    )
}
