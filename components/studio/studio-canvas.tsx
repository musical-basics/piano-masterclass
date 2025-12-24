"use client"

import { useState, useCallback } from "react"
import { GripVertical, Trash2, Type, Video, Music2, FileText, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { VideoUploader } from "./VideoUploader"
import { PDFUploader } from "./PDFUploader"
import { updateBlock, deleteBlock } from "@/lib/actions/studio"

interface ContentBlock {
    id: string
    type: "text" | "video" | "sheet_music" | "audio"
    content: Record<string, unknown>
    order: number
}

interface StudioCanvasProps {
    blocks: ContentBlock[]
    lessonId: string
    bunnyLibraryId: string
    onBlocksChange: () => void
}

export function StudioCanvas({ blocks, lessonId, bunnyLibraryId, onBlocksChange }: StudioCanvasProps) {
    const [playingAudio, setPlayingAudio] = useState<string | null>(null)
    const [editingTextId, setEditingTextId] = useState<string | null>(null)
    const [textContent, setTextContent] = useState<string>("")
    const [isSavingText, setIsSavingText] = useState(false)

    const handleDeleteBlock = async (blockId: string) => {
        if (confirm("Are you sure you want to delete this block?")) {
            await deleteBlock(blockId)
            onBlocksChange()
        }
    }

    const handleTextEdit = (block: ContentBlock) => {
        setEditingTextId(block.id)
        setTextContent((block.content.html as string) || "")
    }

    const handleSaveText = async (blockId: string) => {
        setIsSavingText(true)
        try {
            await updateBlock(blockId, { html: textContent })
            setEditingTextId(null)
            onBlocksChange()
        } finally {
            setIsSavingText(false)
        }
    }

    const handleCancelTextEdit = () => {
        setEditingTextId(null)
        setTextContent("")
    }

    const getBlockIcon = (type: string) => {
        switch (type) {
            case "text":
                return Type
            case "video":
                return Video
            case "sheet_music":
                return Music2
            case "audio":
                return Music2
            default:
                return FileText
        }
    }

    const getBlockColor = (type: string) => {
        switch (type) {
            case "text":
                return "daw-cyan"
            case "video":
                return "daw-purple"
            case "sheet_music":
                return "daw-pink"
            case "audio":
                return "daw-cyan"
            default:
                return "daw-purple"
        }
    }

    return (
        <main className="flex-1 overflow-y-auto bg-background/50 scrollbar-thin">
            <div className="max-w-3xl mx-auto p-6 space-y-4">
                {blocks.map((block, index) => {
                    const Icon = getBlockIcon(block.type)
                    const color = getBlockColor(block.type)

                    return (
                        <div
                            key={block.id}
                            className={cn(
                                "group relative rounded-xl border bg-card/80 backdrop-blur-sm",
                                "transition-all duration-200",
                                "hover:border-daw-purple/30 border-border/50",
                            )}
                        >
                            {/* Block Header */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
                                <button className="p-1 text-muted-foreground/50 hover:text-muted-foreground cursor-grab">
                                    <GripVertical className="w-4 h-4" />
                                </button>

                                <div
                                    className={cn(
                                        "w-6 h-6 rounded flex items-center justify-center",
                                        `bg-${color}/20 border border-${color}/30`,
                                    )}
                                >
                                    <Icon className={cn("w-3 h-3", `text-${color}`)} />
                                </div>

                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {block.type.replace("_", " ")}
                                </span>

                                <div className="flex-1" />

                                <button
                                    onClick={() => handleDeleteBlock(block.id)}
                                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Block Content */}
                            <div className="p-4">
                                {block.type === "text" && (
                                    <div className="space-y-3">
                                        {editingTextId === block.id ? (
                                            <>
                                                <textarea
                                                    value={textContent}
                                                    onChange={(e) => setTextContent(e.target.value)}
                                                    className="w-full min-h-[150px] p-3 rounded-lg bg-secondary/50 border border-border/50 focus:border-daw-cyan/50 focus:ring-1 focus:ring-daw-cyan/30 focus:outline-none text-sm text-foreground resize-none"
                                                    placeholder="Start typing your content..."
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSaveText(block.id)}
                                                        disabled={isSavingText}
                                                        className="bg-daw-cyan hover:bg-daw-cyan/90 text-white"
                                                    >
                                                        {isSavingText ? "Saving..." : "Save"}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={handleCancelTextEdit}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div
                                                onClick={() => handleTextEdit(block)}
                                                className="min-h-[100px] p-3 rounded-lg bg-secondary/30 border border-border/30 cursor-text hover:border-daw-cyan/30 transition-colors"
                                            >
                                                {block.content.html ? (
                                                    <div
                                                        className="prose prose-invert prose-sm max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: block.content.html as string }}
                                                    />
                                                ) : (
                                                    <p className="text-muted-foreground text-sm italic">Click to edit text...</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {block.type === "video" && (
                                    <VideoUploader
                                        blockId={block.id}
                                        existingVideoId={block.content.videoId as string | undefined}
                                        bunnyLibraryId={bunnyLibraryId}
                                        onUploadComplete={() => onBlocksChange()}
                                    />
                                )}

                                {block.type === "sheet_music" && (
                                    <PDFUploader
                                        blockId={block.id}
                                        existingPdfUrl={block.content.pdfUrl as string | undefined}
                                        existingFilename={block.content.filename as string | undefined}
                                        onUploadComplete={() => onBlocksChange()}
                                    />
                                )}

                                {block.type === "audio" && (
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setPlayingAudio(playingAudio === block.id ? null : block.id)}
                                            className="w-12 h-12 rounded-full bg-daw-cyan/20 border border-daw-cyan/50 flex items-center justify-center hover:bg-daw-cyan/30 transition-all flex-shrink-0"
                                        >
                                            {playingAudio === block.id ? (
                                                <Pause className="w-5 h-5 text-daw-cyan" fill="currentColor" />
                                            ) : (
                                                <Play className="w-5 h-5 text-daw-cyan ml-0.5" fill="currentColor" />
                                            )}
                                        </button>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-foreground">
                                                {(block.content.title as string) || "Audio Track"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Click to play</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}

                {/* Empty state */}
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
