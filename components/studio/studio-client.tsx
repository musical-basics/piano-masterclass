"use client"

import { useState, useCallback, useTransition } from "react"
import { StudioCanvas } from "@/components/studio/studio-canvas"
import { AddContentSidebar, type BlockType } from "@/components/studio/add-content-sidebar"
import { StudioHeader } from "@/components/studio/studio-header"
import { addBlock } from "@/lib/actions/studio"

interface ContentBlock {
    id: string
    type: "text" | "video" | "sheet_music" | "audio"
    content: Record<string, unknown>
    order: number
}

interface StudioClientProps {
    lessonId: string
    lessonTitle: string
    initialBlocks: ContentBlock[]
    bunnyLibraryId: string
}

export function StudioClient({
    lessonId,
    lessonTitle,
    initialBlocks,
    bunnyLibraryId
}: StudioClientProps) {
    const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isAddingBlock, startAddingBlock] = useTransition()

    const handleAddBlock = useCallback((type: BlockType) => {
        startAddingBlock(async () => {
            let content: Record<string, unknown> = {}

            // Set default content based on block type
            switch (type) {
                case "text":
                    content = { html: "" }
                    break
                case "video":
                    content = { videoId: null }
                    break
                case "sheet_music":
                    content = { pdfUrl: null }
                    break
                case "audio":
                    content = { audioUrl: null, title: "New Audio" }
                    break
            }

            // Map "sheet_music" type for consistency
            const dbType = type as "text" | "video" | "sheet_music"

            const newBlock = await addBlock(lessonId, dbType, content)

            if (newBlock) {
                setBlocks((prev) => [
                    ...prev,
                    {
                        id: newBlock.id,
                        type: newBlock.type as ContentBlock["type"],
                        content: newBlock.content as Record<string, unknown>,
                        order: newBlock.order,
                    },
                ])
            }
        })
    }, [lessonId])

    const handleBlocksChange = useCallback(() => {
        // Refresh blocks from server - in a real app you'd refetch
        // For now, this is handled by revalidatePath in the server actions
        window.location.reload()
    }, [])

    const handleSave = useCallback(() => {
        setIsSaving(true)
        // All saves happen automatically via server actions
        setTimeout(() => {
            setIsSaving(false)
        }, 500)
    }, [])

    return (
        <div className="h-screen flex flex-col bg-background">
            <StudioHeader
                lessonTitle={lessonTitle}
                onSave={handleSave}
                isSaving={isSaving}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
            />

            <div className="flex-1 flex overflow-hidden">
                <StudioCanvas
                    blocks={blocks}
                    lessonId={lessonId}
                    bunnyLibraryId={bunnyLibraryId}
                    onBlocksChange={handleBlocksChange}
                />

                <AddContentSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onAddBlock={handleAddBlock}
                    isAdding={isAddingBlock}
                />
            </div>
        </div>
    )
}
