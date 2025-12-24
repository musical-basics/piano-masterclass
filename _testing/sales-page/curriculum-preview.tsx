"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Music, Headphones, AudioWaveform as Waveform } from "lucide-react"
import { cn } from "@/lib/utils"

interface Module {
  id: string
  title: string
  lessons: string[]
  icon: React.ElementType
}

const modules: Module[] = [
  {
    id: "m1",
    title: "Module 1: Getting Started",
    icon: Headphones,
    lessons: [
      "Welcome to the Studio",
      "Understanding Your Instrument",
      "Posture and Hand Position",
      "Your First Notes",
    ],
  },
  {
    id: "m2",
    title: "Module 2: Music Theory Essentials",
    icon: Music,
    lessons: ["Reading Sheet Music", "Scales and Keys", "Chord Foundations", "Rhythm and Time Signatures"],
  },
  {
    id: "m3",
    title: "Module 3: Building Technique",
    icon: Waveform,
    lessons: ["Finger Independence Exercises", "Dynamic Control", "Pedal Techniques", "Speed and Accuracy Drills"],
  },
  {
    id: "m4",
    title: "Module 4: Playing Real Songs",
    icon: Music,
    lessons: ["Classical Pieces for Beginners", "Pop Song Arrangements", "Jazz Chord Voicings", "Improvisation Basics"],
  },
]

export function CurriculumPreview() {
  const [expandedModules, setExpandedModules] = useState<string[]>(["m1"])

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
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
          {modules.map((module) => {
            const isExpanded = expandedModules.includes(module.id)
            const Icon = module.icon

            return (
              <div
                key={module.id}
                className={cn(
                  "rounded-xl border bg-zinc-900/80 overflow-hidden transition-all",
                  isExpanded ? "border-daw-purple/50" : "border-border/50",
                )}
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        isExpanded
                          ? "bg-daw-purple/20 border border-daw-purple/40"
                          : "bg-secondary border border-border/50",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          isExpanded ? "text-daw-purple" : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-lg font-medium transition-colors",
                        isExpanded ? "text-foreground" : "text-foreground/80",
                      )}
                    >
                      {module.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn("w-5 h-5 text-muted-foreground transition-transform", isExpanded && "rotate-180")}
                  />
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <div className="px-5 pb-5">
                    <div className="ml-14 space-y-2 pt-2 border-t border-border/30">
                      {module.lessons.map((lesson, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-daw-cyan/60" />
                          <span className="text-sm">{lesson}</span>
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
