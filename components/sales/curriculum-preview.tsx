"use client"

import { useState } from "react"
import { ChevronDown, Music, Headphones, AudioWaveform as Waveform } from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson {
    id: string
    title: string
}

interface Section {
    id: string
    title: string
    lessons: Lesson[]
}

interface CurriculumPreviewProps {
    sections: Section[]
}

// Cycle through icons for visual variety
const icons = [Headphones, Music, Waveform]

export function CurriculumPreview({ sections }: CurriculumPreviewProps) {
    const [expandedModules, setExpandedModules] = useState<string[]>(
        sections.length > 0 ? [sections[0].id] : []
    )

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
        )
    }

    return (
        <section className="py-24 bg-background relative">
            {/* Background accent */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#06b6d4]/10 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Course Curriculum</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A structured path from beginner to confident pianist
                    </p>
                </div>

                {/* Accordion List */}
                <div className="space-y-3">
                    {sections.map((section, index) => {
                        const isExpanded = expandedModules.includes(section.id)
                        const Icon = icons[index % icons.length]

                        return (
                            <div
                                key={section.id}
                                className={cn(
                                    "rounded-xl border bg-zinc-900/80 overflow-hidden transition-all",
                                    isExpanded ? "border-daw-purple/50" : "border-border/50"
                                )}
                            >
                                {/* Module Header */}
                                <button
                                    onClick={() => toggleModule(section.id)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                                isExpanded
                                                    ? "bg-daw-purple/20 border border-daw-purple/40"
                                                    : "bg-secondary border border-border/50"
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    "w-5 h-5 transition-colors",
                                                    isExpanded ? "text-daw-purple" : "text-muted-foreground"
                                                )}
                                            />
                                        </div>
                                        <div className="text-left">
                                            <span
                                                className={cn(
                                                    "text-lg font-medium transition-colors block",
                                                    isExpanded ? "text-foreground" : "text-foreground/80"
                                                )}
                                            >
                                                {section.title}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {section.lessons.length} lesson{section.lessons.length !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={cn("w-5 h-5 text-muted-foreground transition-transform", isExpanded && "rotate-180")}
                                    />
                                </button>

                                {/* Lessons List */}
                                {isExpanded && (
                                    <div className="px-5 pb-5">
                                        <div className="ml-14 space-y-2 pt-2 border-t border-border/30">
                                            {section.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className="flex items-center gap-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-daw-cyan/60" />
                                                    <span className="text-sm">{lesson.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
