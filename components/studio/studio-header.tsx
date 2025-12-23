"use client"

import { Save, Loader2, PanelRightClose, PanelRight, Music2, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface StudioHeaderProps {
    lessonTitle?: string
    onSave: () => void
    isSaving: boolean
    onToggleSidebar: () => void
    isSidebarOpen: boolean
}

export function StudioHeader({
    lessonTitle = "Untitled Lesson",
    onSave,
    isSaving,
    onToggleSidebar,
    isSidebarOpen
}: StudioHeaderProps) {
    return (
        <header className="h-14 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0">
            {/* Left - Back and Title */}
            <div className="flex items-center gap-3">
                <Link
                    href="/admin"
                    className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-daw-purple/20 border border-daw-purple/30 flex items-center justify-center">
                        <Music2 className="w-4 h-4 text-daw-purple" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold">Lesson Studio</h1>
                        <p className="text-[10px] text-muted-foreground">Editing: {lessonTitle}</p>
                    </div>
                </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleSidebar}
                    className="text-muted-foreground hover:text-foreground"
                >
                    {isSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
                </Button>

                <Button
                    onClick={onSave}
                    disabled={isSaving}
                    size="sm"
                    className={cn("bg-daw-purple hover:bg-daw-purple/90 text-white gap-2", isSaving && "opacity-80")}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                        </>
                    )}
                </Button>
            </div>
        </header>
    )
}
