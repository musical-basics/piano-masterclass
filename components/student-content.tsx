"use client"

import type React from "react"

import { useState } from "react"
import {
  Play,
  Pause,
  Volume2,
  Maximize2,
  PictureInPicture2,
  FileText,
  MessageSquare,
  Info,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentBlock {
  id: string
  type: string
  content: Record<string, unknown>
  order: number
}

interface StudentContentProps {
  activeTab: "overview" | "sheet" | "discussion"
  onTabChange: (tab: "overview" | "sheet" | "discussion") => void
  isPiPActive: boolean
  onTogglePiP: () => void
  lessonTitle: string
  contentBlocks: ContentBlock[]
}

export function StudentContent({
  activeTab,
  onTabChange,
  isPiPActive,
  onTogglePiP,
  lessonTitle,
  contentBlocks,
}: StudentContentProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <main className="relative flex flex-col">
      <div
        className={cn(
          "sticky top-0 z-40 bg-background",
          isPiPActive && "relative", // Disable sticky when PiP is active
        )}
      >
        <div className="w-full md:max-w-5xl md:mx-auto md:p-6 md:pb-0">
          <div
            className={cn(
              "relative aspect-video bg-zinc-900 md:rounded-xl border-b md:border border-border/50 overflow-hidden group transition-all",
              isPiPActive &&
              "fixed bottom-20 right-4 md:bottom-24 md:right-6 w-64 md:w-80 aspect-video z-50 shadow-2xl shadow-black/50 rounded-xl border",
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-br from-daw-purple/5 to-daw-cyan/5" />

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-daw-purple/20 backdrop-blur-sm border border-daw-purple/50 flex items-center justify-center hover:bg-daw-purple/30 hover:scale-105 transition-all glow-purple"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" fill="currentColor" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                )}
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-daw-purple transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group/progress">
                  <div className="h-full w-1/3 bg-daw-purple rounded-full relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                  </div>
                </div>

                <span className="font-mono text-xs text-white/80">
                  <span className="text-white">3:24</span> / 10:24
                </span>

                <button className="text-white/80 hover:text-white transition-colors">
                  <Volume2 className="w-5 h-5" />
                </button>

                <button
                  onClick={onTogglePiP}
                  className={cn("text-white/80 hover:text-white transition-colors", isPiPActive && "text-daw-cyan")}
                  title="Picture in Picture"
                >
                  <PictureInPicture2 className="w-5 h-5" />
                </button>

                <button className="text-white/80 hover:text-white transition-colors">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="absolute top-4 left-4 right-4 flex items-start justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider">Now Playing</p>
                <h2 className="text-lg font-semibold text-white">{lessonTitle}</h2>
              </div>
            </div>

            {!isPiPActive && (
              <button
                onClick={onTogglePiP}
                className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-black/70 transition-all"
                title="Float video"
              >
                <PictureInPicture2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 md:px-6 md:py-6 md:max-w-5xl md:mx-auto w-full space-y-4 md:space-y-6 pb-28 md:pb-32">
        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg w-full md:w-fit overflow-x-auto">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => onTabChange("overview")}
            icon={<Info className="w-4 h-4" />}
            label="Overview"
          />
          <TabButton
            active={activeTab === "sheet"}
            onClick={() => onTabChange("sheet")}
            icon={<FileText className="w-4 h-4" />}
            label="Sheet Music"
          />
          <TabButton
            active={activeTab === "discussion"}
            onClick={() => onTabChange("discussion")}
            icon={<MessageSquare className="w-4 h-4" />}
            label="Discussion"
          />
        </div>

        <div className="min-h-screen">
          {activeTab === "overview" && <OverviewTab contentBlocks={contentBlocks} />}
          {activeTab === "sheet" && <SheetMusicTab contentBlocks={contentBlocks} />}
          {activeTab === "discussion" && <DiscussionTab />}
        </div>
      </div>
    </main>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
        active
          ? "bg-daw-purple text-white shadow-lg glow-purple"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary",
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function OverviewTab({ contentBlocks }: { contentBlocks: ContentBlock[] }) {
  // Filter text content blocks for the overview
  const textBlocks = contentBlocks.filter((block) => block.type === "text")

  return (
    <div className="space-y-6">
      {/* Render text content blocks */}
      {textBlocks.length > 0 ? (
        textBlocks.map((block) => (
          <div
            key={block.id}
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: (block.content.html as string) || "" }}
          />
        ))
      ) : (
        <div className="prose prose-invert max-w-none">
          <h3 className="text-xl font-semibold text-foreground">About this lesson</h3>
          <p className="text-muted-foreground leading-relaxed">
            Lesson content will appear here.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">What you&apos;ll learn</h4>
          <ul className="space-y-2">
            {[
              "Proper posture at the piano",
              "Hand positioning fundamentals",
              "Basic finger exercises",
              "Reading simple notation",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-daw-purple" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card rounded-lg border border-border/50 p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Resources</h4>
          <div className="space-y-2">
            {contentBlocks
              .filter((block) => block.type === "sheet_music")
              .map((block) => (
                <a
                  key={block.id}
                  href={block.content.pdfUrl as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 p-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-daw-cyan flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">Sheet Music</p>
                    <p className="text-xs text-muted-foreground">PDF</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SheetMusicTab({ contentBlocks }: { contentBlocks: ContentBlock[] }) {
  const sheetMusicBlocks = contentBlocks.filter((block) => block.type === "sheet_music")

  if (sheetMusicBlocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Sheet Music Available</h3>
        <p className="text-muted-foreground">This lesson doesn&apos;t have any sheet music attached.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sheetMusicBlocks.map((block) => {
        const pdfUrl = block.content.pdfUrl as string

        return (
          <div key={block.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Sheet Music</h3>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="w-4 h-4" />
                Download PDF
              </a>
            </div>

            <div className="bg-zinc-800 rounded-xl p-6 border border-border/50">
              <iframe
                src={`${pdfUrl}#view=FitH`}
                className="w-full h-[600px] rounded-lg bg-white"
                title="Sheet Music PDF"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DiscussionTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Discussion</h3>
        <span className="text-sm text-muted-foreground">24 comments</span>
      </div>

      <div className="bg-card rounded-lg border border-border/50 p-4">
        <textarea
          placeholder="Share your thoughts or ask a question..."
          className="w-full bg-secondary/50 rounded-md p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-daw-purple"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button className="px-4 py-2 rounded-md bg-daw-purple text-white text-sm font-medium hover:bg-daw-purple/90 transition-colors">
            Post Comment
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            author: "Alex Rivera",
            time: "2 hours ago",
            content: "Great explanation of the modes! I finally understand the difference between Dorian and Aeolian.",
            likes: 12,
          },
          {
            author: "Jordan Chen",
            time: "5 hours ago",
            content: "Would love to see more examples of how to use Lydian mode in electronic music production.",
            likes: 8,
          },
          {
            author: "Sam Taylor",
            time: "1 day ago",
            content: "The MIDI files are super helpful. Been practicing with them all week!",
            likes: 15,
          },
        ].map((comment, i) => (
          <div key={i} className="bg-card rounded-lg border border-border/50 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-daw-purple/20 flex items-center justify-center text-sm font-medium text-daw-purple">
                {comment.author[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{comment.author}</p>
                <p className="text-xs text-muted-foreground">{comment.time}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{comment.content}</p>
            <div className="flex items-center gap-4 mt-3">
              <button className="text-xs text-muted-foreground hover:text-daw-purple transition-colors">
                Like ({comment.likes})
              </button>
              <button className="text-xs text-muted-foreground hover:text-daw-purple transition-colors">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
