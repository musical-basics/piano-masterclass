"use client"

import { useState, useEffect } from "react"
import { CurriculumSidebar } from "@/components/curriculum-sidebar"
import { LessonCanvas } from "@/components/lesson-canvas"
import { BlockToolbox } from "@/components/block-toolbox"
import { Header } from "@/components/header"

export default function CourseEditor() {
    const [selectedLessonId, setSelectedLessonId] = useState("l1")
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    // Simulate save functionality
    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1500)
    }

    // Simulate upload progress
    useEffect(() => {
        if (isUploading) {
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        setIsUploading(false)
                        return 0
                    }
                    return prev + 5
                })
            }, 150)
            return () => clearInterval(interval)
        }
    }, [isUploading])

    const handleAddBlock = (type: string) => {
        if (type === "video") {
            // Simulate video upload
            setIsUploading(true)
            setUploadProgress(0)
        }
        // In a real app, you would add the block to state here
    }

    return (
        <div className="h-screen flex flex-col bg-background">
            <Header onSave={handleSave} isSaving={isSaving} />

            <div className="flex-1 flex overflow-hidden">
                <CurriculumSidebar selectedLessonId={selectedLessonId} onSelectLesson={setSelectedLessonId} />
                <LessonCanvas uploadProgress={uploadProgress} isUploading={isUploading} />
                <BlockToolbox onAddBlock={handleAddBlock} />
            </div>
        </div>
    )
}
