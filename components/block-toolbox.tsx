"use client"

import { useState } from "react"
import { Type, Video, Music2, FileText, AudioWaveform } from "lucide-react"
import { cn } from "@/lib/utils"

const tools = [
  { id: "text", icon: Type, label: "Add Text", color: "daw-blue" },
  { id: "video", icon: Video, label: "Add Video", color: "daw-purple" },
  { id: "audio", icon: AudioWaveform, label: "Add Audio", color: "daw-cyan" },
  { id: "sheet", icon: Music2, label: "Sheet Music", color: "daw-pink" },
  { id: "pdf", icon: FileText, label: "Add PDF", color: "daw-amber" },
]

interface BlockToolboxProps {
  onAddBlock: (type: string) => void
}

export function BlockToolbox({ onAddBlock }: BlockToolboxProps) {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      {/* Glassmorphism Panel */}
      <div className="bg-popover/80 backdrop-blur-md border border-border/50 rounded-xl p-2 space-y-2 shadow-2xl">
        {tools.map((tool) => (
          <div key={tool.id} className="relative">
            <button
              onClick={() => onAddBlock(tool.id)}
              onMouseEnter={() => setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
              className={cn(
                "w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200",
                "border border-transparent hover:border-border/50",
                "text-muted-foreground hover:text-foreground",
                hoveredTool === tool.id && "bg-secondary/50",
              )}
            >
              <tool.icon className={cn("w-5 h-5 transition-colors", hoveredTool === tool.id && `text-${tool.color}`)} />
            </button>

            {/* Tooltip - Changed from font-mono to font-sans */}
            {hoveredTool === tool.id && (
              <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap">
                <div className="bg-popover/95 backdrop-blur-sm border border-border/50 rounded-md px-3 py-1.5 text-xs font-medium text-foreground shadow-lg">
                  {tool.label}
                  {/* Arrow */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-border/50" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
