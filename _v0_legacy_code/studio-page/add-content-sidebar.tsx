"use client"

import { X, Type, Video, Music2, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BlockType } from "@/app/studio/page"

const contentTypes = [
  {
    id: "text" as BlockType,
    icon: Type,
    label: "Text & Images",
    description: "Rich text content",
  },
  {
    id: "video" as BlockType,
    icon: Video,
    label: "Video",
    description: "Upload or embed",
  },
  {
    id: "sheet" as BlockType,
    icon: Music2,
    label: "PDF Viewer",
    description: "Sheet music & docs",
  },
  {
    id: "audio" as BlockType,
    icon: Headphones,
    label: "Audio",
    description: "Music & voiceover",
  },
]

interface AddContentSidebarProps {
  isOpen: boolean
  onClose: () => void
  onAddBlock: (type: BlockType) => void
}

export function AddContentSidebar({ isOpen, onClose, onAddBlock }: AddContentSidebarProps) {
  if (!isOpen) return null

  return (
    <aside className="w-72 border-l border-border/50 bg-card/50 backdrop-blur-sm flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <h2 className="text-sm font-semibold">Add content</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Grid */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-2 gap-3">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onAddBlock(type.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-4 rounded-xl",
                "bg-secondary/50 border border-border/50",
                "hover:bg-secondary hover:border-daw-purple/50",
                "transition-all duration-200 group",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  "bg-background/50 border border-border/50",
                  "group-hover:border-daw-purple/30 group-hover:bg-daw-purple/10",
                  "transition-colors",
                )}
              >
                <type.icon className="w-5 h-5 text-muted-foreground group-hover:text-daw-purple transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">{type.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{type.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-border/30" />

        {/* Tips Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tips</h3>
          <div className="space-y-2 text-xs text-muted-foreground/80">
            <p className="flex items-start gap-2">
              <span className="text-daw-purple">•</span>
              Drag blocks to reorder your lesson content
            </p>
            <p className="flex items-start gap-2">
              <span className="text-daw-cyan">•</span>
              Upload high-quality video for best experience
            </p>
            <p className="flex items-start gap-2">
              <span className="text-daw-pink">•</span>
              PDF files will be displayed as sheet music
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
