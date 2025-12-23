"use client"

import { useState } from "react"
import {
  Trash2,
  GripVertical,
  Play,
  Pause,
  Upload,
  FileText,
  Bold,
  Italic,
  List,
  LinkIcon,
  ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { ContentBlock, BlockType } from "@/app/studio/page"

interface StudioCanvasProps {
  blocks: ContentBlock[]
  onRemoveBlock: (id: string) => void
  onUpdateBlock: (id: string, content: string) => void
}

export function StudioCanvas({ blocks, onRemoveBlock, onUpdateBlock }: StudioCanvasProps) {
  const [lessonTitle, setLessonTitle] = useState("Lesson 1: Welcome to the Studio")
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null)

  const getBorderColor = (type: BlockType) => {
    switch (type) {
      case "text":
        return "border-l-daw-blue"
      case "video":
        return "border-l-daw-purple"
      case "sheet":
        return "border-l-daw-pink"
      case "audio":
        return "border-l-daw-cyan"
      default:
        return "border-l-border"
    }
  }

  const getBlockLabel = (type: BlockType) => {
    switch (type) {
      case "text":
        return "Text Block"
      case "video":
        return "Video"
      case "sheet":
        return "Sheet Music"
      case "audio":
        return "Audio"
      default:
        return type
    }
  }

  return (
    <main className="flex-1 h-full overflow-y-auto scrollbar-thin p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Lesson Title */}
        <input
          type="text"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          className="w-full bg-transparent text-3xl md:text-4xl font-bold text-foreground border-none outline-none focus:ring-0 placeholder:text-muted-foreground tracking-tight"
          placeholder="Enter lesson title..."
        />

        {/* Content Blocks */}
        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={cn(
                "relative group bg-card rounded-lg border border-border/50 transition-all hover:border-border",
                "border-l-4",
                getBorderColor(block.type),
                focusedBlock === block.id && "ring-1 ring-daw-purple/50",
              )}
            >
              {/* Block Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {getBlockLabel(block.type)}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveBlock(block.id)}
                  className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Block Content */}
              <div className="p-4">
                {block.type === "text" && (
                  <div className="space-y-3">
                    {/* Rich Text Toolbar */}
                    <div className="flex items-center gap-1 pb-3 border-b border-border/30">
                      <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <Bold className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <Italic className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-border mx-1" />
                      <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <List className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Text Input */}
                    <textarea
                      value={block.content}
                      onChange={(e) => onUpdateBlock(block.id, e.target.value)}
                      onFocus={() => setFocusedBlock(block.id)}
                      onBlur={() => setFocusedBlock(null)}
                      className="w-full bg-transparent text-sm text-foreground/90 leading-relaxed resize-none outline-none placeholder:text-muted-foreground min-h-[100px]"
                      placeholder="Start typing your content..."
                    />
                  </div>
                )}

                {block.type === "video" && (
                  <div className="space-y-4">
                    {/* Video Placeholder */}
                    <div className="relative aspect-video bg-secondary/50 rounded-lg overflow-hidden border border-border/30">
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-daw-purple/20 border border-daw-purple/30 flex items-center justify-center">
                          <Play className="w-6 h-6 text-daw-purple ml-1" />
                        </div>
                        <p className="text-sm text-muted-foreground">No video uploaded</p>
                      </div>
                      {/* Corner accents */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-daw-purple/40" />
                      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-daw-purple/40" />
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-daw-purple/40" />
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-daw-purple/40" />
                    </div>
                    {/* Replace Video Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed border-border hover:border-daw-purple hover:text-daw-purple transition-colors gap-2 bg-transparent"
                    >
                      <Upload className="w-4 h-4" />
                      Replace Video
                    </Button>
                  </div>
                )}

                {block.type === "sheet" && (
                  <div className="space-y-3">
                    {/* PDF Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-daw-pink/20 border border-daw-pink/30 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-daw-pink" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{block.content}</p>
                        <p className="text-xs text-muted-foreground">PDF Document</p>
                      </div>
                    </div>
                    {/* Sheet Music Preview - White PDF page */}
                    <div className="bg-white rounded-md p-6 aspect-[4/3] relative overflow-hidden shadow-inner">
                      {/* Staff lines */}
                      <div className="absolute inset-x-8 top-[20%] space-y-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-px bg-zinc-300" />
                        ))}
                      </div>
                      <div className="absolute inset-x-8 top-[45%] space-y-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-px bg-zinc-300" />
                        ))}
                      </div>
                      <div className="absolute inset-x-8 top-[70%] space-y-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-px bg-zinc-300" />
                        ))}
                      </div>
                      {/* Clefs */}
                      <div className="absolute left-10 top-[16%] text-3xl text-zinc-400 font-serif">𝄞</div>
                      <div className="absolute left-10 top-[41%] text-3xl text-zinc-400 font-serif">𝄢</div>
                      <div className="absolute left-10 top-[66%] text-3xl text-zinc-400 font-serif">𝄞</div>
                      {/* Notes */}
                      <div className="absolute top-[18%] left-[15%] flex gap-6">
                        {["●", "●", "○", "●", "○", "●", "●"].map((note, i) => (
                          <span key={i} className="text-zinc-600 text-base">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Replace PDF Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed border-border hover:border-daw-pink hover:text-daw-pink transition-colors gap-2 bg-transparent"
                    >
                      <Upload className="w-4 h-4" />
                      Replace PDF
                    </Button>
                  </div>
                )}

                {block.type === "audio" && (
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
                      {/* Waveform bars */}
                      <div className="flex-1 flex items-center gap-[2px] h-10">
                        {[...Array(60)].map((_, i) => {
                          const height = Math.sin(i * 0.3) * 0.4 + Math.random() * 0.4 + 0.2
                          const isPlayed = playingAudio === block.id && i < 20
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
                    {/* Replace Audio Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed border-border hover:border-daw-cyan hover:text-daw-cyan transition-colors gap-2 bg-transparent"
                    >
                      <Upload className="w-4 h-4" />
                      Replace Audio
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state hint */}
        {blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground mb-1">No content blocks yet</p>
            <p className="text-sm text-muted-foreground/70">Use the sidebar to add your first block</p>
          </div>
        )}
      </div>
    </main>
  )
}
