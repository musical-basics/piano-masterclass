"use client"

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useState } from "react"

interface FlowBarProps {
  previousLesson: string | null
  courseProgress: number
  onPrevious: () => void
  onComplete: () => void
}

export function FlowBar({ previousLesson, courseProgress, onPrevious, onComplete }: FlowBarProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = () => {
    setIsCompleting(true)
    setTimeout(() => {
      setIsCompleting(false)
      onComplete()
    }, 1500)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Glassmorphism Bar */}
      <div className="bg-zinc-900/80 backdrop-blur-xl border-t border-white/10 px-3 py-2 md:px-6 md:py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Previous Lesson */}
          <button
            onClick={onPrevious}
            disabled={!previousLesson}
            className="flex items-center gap-1 md:gap-2 text-muted-foreground hover:text-foreground transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left hidden sm:block">
              <p className="text-xs text-muted-foreground">Previous</p>
              <p className="text-sm font-medium truncate max-w-[120px]">{previousLesson || "—"}</p>
            </div>
          </button>

          {/* Center Progress */}
          <div className="hidden sm:flex flex-col items-center gap-1 md:gap-2 flex-1 max-w-[200px] md:max-w-xs mx-2 md:mx-8">
            <div className="w-full h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-daw-purple rounded-full transition-all duration-500 glow-purple"
                style={{ width: `${courseProgress}%` }}
              />
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              <span className="text-daw-purple font-medium">{courseProgress}%</span> Complete
            </p>
          </div>

          {/* Complete & Continue Button */}
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-6 md:py-3 rounded-lg bg-daw-purple text-white font-medium text-xs md:text-sm hover:bg-daw-purple/90 transition-all glow-purple disabled:opacity-80 group"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <span className="sm:hidden">Next</span>
                <span className="hidden sm:inline">Complete & Continue</span>
                <ChevronRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
