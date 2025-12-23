"use client"

import { useState } from "react"
import { Play, Pause, Trash2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentBlock {
  id: string
  type: "text" | "sheet" | "warning" | "video" | "audio"
  content: string
  duration?: string
}

const initialBlocks: ContentBlock[] = [
  {
    id: "b1",
    type: "text",
    content:
      "Welcome to your first music production lesson! In this module, you'll learn the fundamentals of rhythm and how to create your first beat using industry-standard techniques.",
  },
  {
    id: "b2",
    type: "sheet",
    content: "C Major Scale - Exercise 1",
  },
  {
    id: "b3",
    type: "audio",
    content: "Demo_Beat_120BPM.wav",
    duration: "2:34",
  },
  {
    id: "b4",
    type: "warning",
    content: "Make sure your audio interface is connected and your headphones are on before playing the audio samples.",
  },
]

interface LessonCanvasProps {
  uploadProgress: number
  isUploading: boolean
}

export function LessonCanvas({ uploadProgress, isUploading }: LessonCanvasProps) {
  const [title, setTitle] = useState("Lesson 1: Welcome to the Studio")
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }

  const getBorderColor = (type: ContentBlock["type"]) => {
    switch (type) {
      case "text":
        return "border-l-daw-blue"
      case "sheet":
        return "border-l-daw-pink"
      case "warning":
        return "border-l-daw-amber"
      case "video":
        return "border-l-daw-purple"
      case "audio":
        return "border-l-daw-cyan"
      default:
        return "border-l-border"
    }
  }

  return (
    <main className="flex-1 h-full overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Editable Title - Changed from font-mono to font-sans */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-4xl font-bold text-foreground border-none outline-none focus:ring-0 placeholder:text-muted-foreground tracking-tight"
          placeholder="Enter lesson title..."
        />

        {/* Video Player Placeholder */}
        <div className="relative aspect-video bg-card rounded-lg border border-border/50 overflow-hidden group">
          {/* Video Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background flex items-center justify-center">
            <div className="relative">
              <button className="w-20 h-20 rounded-full bg-daw-purple/20 border border-daw-purple/50 flex items-center justify-center hover:bg-daw-purple/30 transition-all glow-purple group-hover:scale-105">
                <Play className="w-8 h-8 text-daw-purple ml-1" fill="currentColor" />
              </button>
              {/* Glow Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-daw-purple/20 animate-ping" />
            </div>
          </div>

          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <p className="text-sm text-daw-purple">Uploading video...</p>
              <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-daw-purple transition-all duration-300 glow-purple"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="font-mono text-xs text-muted-foreground">{uploadProgress}%</span>
            </div>
          )}

          {/* Cinematic Bars */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />

          <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-daw-purple/50" />
          <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-daw-purple/50" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-daw-purple/50" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-daw-purple/50" />
        </div>

        {/* Content Blocks */}
        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={cn(
                "relative group bg-card rounded-lg border border-border/50 p-4 pl-5 border-l-4 transition-all hover:border-border",
                getBorderColor(block.type),
              )}
            >
              {/* Block Type Label */}
              <span className="absolute -top-2 left-4 px-2 py-0.5 bg-card text-[10px] uppercase tracking-wider text-muted-foreground">
                {block.type === "sheet" ? "Sheet Music" : block.type}
              </span>

              {/* Delete Button */}
              <button
                onClick={() => removeBlock(block.id)}
                className="absolute top-2 right-2 p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Block Content */}
              {block.type === "sheet" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-daw-pink">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">{block.content}</span>
                  </div>
                  {/* Sheet Music Preview - White PDF page preview */}
                  <div className="bg-white rounded-md p-4 aspect-[3/2] flex items-center justify-center relative overflow-hidden">
                    {/* Staff lines */}
                    <div className="absolute inset-x-8 top-1/4 space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-px bg-zinc-300" />
                      ))}
                    </div>
                    <div className="absolute inset-x-8 top-1/2 space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-px bg-zinc-300" />
                      ))}
                    </div>
                    {/* Treble clef indicator */}
                    <div className="absolute left-10 top-[22%] text-4xl text-zinc-400 font-serif">𝄞</div>
                    <div className="absolute left-10 top-[48%] text-4xl text-zinc-400 font-serif">𝄢</div>
                    {/* Notes placeholders */}
                    <div className="absolute top-[26%] left-20 flex gap-8">
                      {["●", "●", "○", "●", "○", "●", "●", "○"].map((note, i) => (
                        <span key={i} className="text-zinc-700 text-lg">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : block.type === "audio" ? (
                /* New Audio Player block with waveform visualization */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-daw-cyan">{block.content}</span>
                    <span className="font-mono text-xs text-muted-foreground">{block.duration}</span>
                  </div>
                  {/* Waveform visualization */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPlayingAudio(playingAudio === block.id ? null : block.id)}
                      className="w-10 h-10 rounded-full bg-daw-cyan/20 border border-daw-cyan/50 flex items-center justify-center hover:bg-daw-cyan/30 transition-all flex-shrink-0"
                    >
                      {playingAudio === block.id ? (
                        <Pause className="w-4 h-4 text-daw-cyan" fill="currentColor" />
                      ) : (
                        <Play className="w-4 h-4 text-daw-cyan ml-0.5" fill="currentColor" />
                      )}
                    </button>
                    {/* Waveform bars - Soundcloud style */}
                    <div className="flex-1 flex items-center gap-[2px] h-12">
                      {[...Array(80)].map((_, i) => {
                        const height = Math.sin(i * 0.3) * 0.4 + Math.random() * 0.4 + 0.2
                        const isPlayed = playingAudio === block.id && i < 30
                        return (
                          <div
                            key={i}
                            className={cn(
                              "w-[3px] rounded-full transition-colors",
                              isPlayed ? "bg-daw-cyan" : "bg-daw-cyan/30",
                            )}
                            style={{ height: `${height * 100}%` }}
                          />
                        )
                      })}
                    </div>
                  </div>
                  {/* Progress timestamps */}
                  <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                    <span>{playingAudio === block.id ? "0:45" : "0:00"}</span>
                    <span>{block.duration}</span>
                  </div>
                </div>
              ) : block.type === "warning" ? (
                <p className="text-sm text-daw-amber/90">{block.content}</p>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">{block.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
