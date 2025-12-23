"use client"

import { useState } from "react"
import { StudioCanvas } from "@/components/studio/studio-canvas"
import { AddContentSidebar } from "@/components/studio/add-content-sidebar"
import { StudioHeader } from "@/components/studio/studio-header"

export type BlockType = "text" | "video" | "sheet" | "audio"

export interface ContentBlock {
  id: string
  type: BlockType
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
    type: "video",
    content: "Main Lesson Video",
  },
  {
    id: "b3",
    type: "sheet",
    content: "C Major Scale - Exercise 1.pdf",
  },
]

export default function LessonStudio() {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: `b${Date.now()}`,
      type,
      content:
        type === "text"
          ? "Start typing your content here..."
          : type === "video"
            ? "New Video"
            : type === "audio"
              ? "audio_track.mp3"
              : "New Sheet Music.pdf",
      duration: type === "audio" ? "0:00" : undefined,
    }
    setBlocks([...blocks, newBlock])
  }

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id))
  }

  const handleUpdateBlock = (id: string, content: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <StudioHeader
        onSave={handleSave}
        isSaving={isSaving}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas - takes remaining space */}
        <StudioCanvas blocks={blocks} onRemoveBlock={handleRemoveBlock} onUpdateBlock={handleUpdateBlock} />

        {/* Add Content Sidebar - sticky right */}
        <AddContentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onAddBlock={handleAddBlock} />
      </div>
    </div>
  )
}
