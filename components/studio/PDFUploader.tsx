"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Loader2, CheckCircle, AlertCircle, FileText, Download, Eye, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { updateBlock } from "@/lib/actions/studio"
import { Button } from "@/components/ui/button"

interface PDFUploaderProps {
    blockId: string
    onUploadComplete?: (url: string) => void
    existingPdfUrl?: string
    existingFilename?: string
}

export function PDFUploader({
    blockId,
    onUploadComplete,
    existingPdfUrl,
    existingFilename,
}: PDFUploaderProps) {
    const [uploadState, setUploadState] = useState<"idle" | "uploading" | "complete" | "error">(
        existingPdfUrl ? "complete" : "idle"
    )
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [pdfUrl, setPdfUrl] = useState<string | null>(existingPdfUrl || null)
    const [filename, setFilename] = useState<string | null>(existingFilename || null)
    const [isViewerOpen, setIsViewerOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = useCallback(async (file: File) => {
        if (file.type !== "application/pdf") {
            setError("Please select a PDF file")
            return
        }

        setError(null)
        setUploadState("uploading")
        setProgress(0)

        try {
            const formData = new FormData()
            formData.append("file", file)

            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 10, 90))
            }, 200)

            const response = await fetch("/api/pdf/upload", {
                method: "POST",
                body: formData,
            })

            clearInterval(progressInterval)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Upload failed")
            }

            const data = await response.json()

            setProgress(100)

            // Update the block with the PDF URL
            await updateBlock(blockId, {
                pdfUrl: data.url,
                filename: data.filename,
            })

            setPdfUrl(data.url)
            setFilename(data.filename)
            setUploadState("complete")
            onUploadComplete?.(data.url)

        } catch (err) {
            console.error("Upload error:", err)
            setError(err instanceof Error ? err.message : "Upload failed")
            setUploadState("error")
        }
    }, [blockId, onUploadComplete])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) handleFileSelect(file)
    }, [handleFileSelect])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
    }, [])

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFileSelect(file)
    }

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement("a")
            link.href = pdfUrl
            link.download = filename || "sheet-music.pdf"
            link.target = "_blank"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    // Show PDF viewer if we have a PDF URL
    if (pdfUrl && uploadState === "complete") {
        return (
            <div className="space-y-4">
                {/* PDF Viewer */}
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-daw-pink/30 shadow-lg shadow-daw-pink/10 bg-white">
                    <iframe
                        src={`${pdfUrl}#view=FitH&toolbar=0`}
                        className="absolute inset-0 w-full h-full"
                        title="Sheet Music PDF"
                    />
                </div>

                {/* File info and actions */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-daw-pink/20 border border-daw-pink/30 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-daw-pink" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {filename || "Sheet Music"}
                            </p>
                            <p className="text-xs text-muted-foreground">PDF Document</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsViewerOpen(true)}
                            className="text-muted-foreground hover:text-daw-pink"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="text-muted-foreground hover:text-daw-pink"
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Replace button */}
                <button
                    onClick={handleClick}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-dashed border-border hover:border-daw-pink hover:text-daw-pink transition-colors text-sm text-muted-foreground"
                >
                    <Upload className="w-4 h-4" />
                    Replace PDF
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleInputChange}
                    className="hidden"
                />

                {/* Full-screen viewer modal */}
                {isViewerOpen && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl">
                            <div className="absolute top-2 right-2 z-10 flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleDownload}
                                    className="gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => setIsViewerOpen(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <iframe
                                src={pdfUrl}
                                className="w-full h-full"
                                title="Sheet Music PDF"
                            />
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div
            onClick={uploadState === "idle" || uploadState === "error" ? handleClick : undefined}
            onDrop={uploadState === "idle" ? handleDrop : undefined}
            onDragOver={handleDragOver}
            className={cn(
                "relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-dashed transition-all cursor-pointer",
                uploadState === "idle" && "border-border/50 hover:border-daw-pink/50 bg-secondary/50",
                uploadState === "uploading" && "border-daw-pink/50 bg-daw-pink/5",
                uploadState === "error" && "border-red-500/50 bg-red-500/5",
            )}
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {uploadState === "idle" && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-daw-pink/20 border border-daw-pink/30 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-daw-pink" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-foreground font-medium">Drop PDF here or click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">Sheet music, scores, and documents</p>
                        </div>
                    </>
                )}

                {uploadState === "uploading" && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-daw-pink/20 border border-daw-pink/30 flex items-center justify-center relative">
                            <FileText className="w-6 h-6 text-daw-pink" />
                            <svg className="absolute inset-0" viewBox="0 0 64 64">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    className="text-daw-pink/20"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    className="text-daw-pink"
                                    strokeDasharray={175.93}
                                    strokeDashoffset={175.93 * (1 - progress / 100)}
                                    transform="rotate(-90 32 32)"
                                />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-daw-pink">{progress}%</p>
                            <p className="text-xs text-muted-foreground">Uploading PDF...</p>
                        </div>
                    </>
                )}

                {uploadState === "error" && (
                    <>
                        <AlertCircle className="w-10 h-10 text-red-500" />
                        <div className="text-center">
                            <p className="text-sm text-red-500 font-medium">Upload failed</p>
                            <p className="text-xs text-red-400 mt-1">{error}</p>
                            <p className="text-xs text-muted-foreground mt-2">Click to try again</p>
                        </div>
                    </>
                )}
            </div>

            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-daw-pink/40" />
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-daw-pink/40" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-daw-pink/40" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-daw-pink/40" />

            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleInputChange}
                className="hidden"
            />
        </div>
    )
}
