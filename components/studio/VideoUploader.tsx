"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Loader2, CheckCircle, AlertCircle, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { updateBlock } from "@/lib/actions/studio"
import * as tus from "tus-js-client"

interface VideoUploaderProps {
    blockId: string
    onUploadComplete?: (videoId: string) => void
    existingVideoId?: string
    bunnyLibraryId?: string
}

export function VideoUploader({
    blockId,
    onUploadComplete,
    existingVideoId,
    bunnyLibraryId,
}: VideoUploaderProps) {
    const [uploadState, setUploadState] = useState<"idle" | "signing" | "uploading" | "complete" | "error">("idle")
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [videoId, setVideoId] = useState<string | null>(existingVideoId || null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const uploadRef = useRef<tus.Upload | null>(null)

    const handleFileSelect = useCallback(async (file: File) => {
        if (!file.type.startsWith("video/")) {
            setError("Please select a video file")
            return
        }

        setError(null)
        setUploadState("signing")

        try {
            // Step 1: Get signature from our API
            const signResponse = await fetch("/api/bunny/sign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: file.name }),
            })

            if (!signResponse.ok) {
                const errorData = await signResponse.json()
                throw new Error(errorData.error || "Failed to get upload signature")
            }

            const signData = await signResponse.json()
            const { videoId: newVideoId, libraryId, authorizationSignature, authorizationExpire } = signData

            setUploadState("uploading")

            // Step 2: Upload using TUS protocol
            const upload = new tus.Upload(file, {
                endpoint: "https://video.bunnycdn.com/tusupload",
                retryDelays: [0, 3000, 5000, 10000, 20000],
                chunkSize: 5 * 1024 * 1024, // 5MB chunks for Bunny.net
                headers: {
                    "AuthorizationSignature": authorizationSignature,
                    "AuthorizationExpire": authorizationExpire.toString(),
                    "VideoId": newVideoId,
                    "LibraryId": libraryId,
                },
                metadata: {
                    filetype: file.type,
                    title: file.name,
                },
                onError: (err) => {
                    console.error("TUS upload error:", err)
                    setError(err.message || "Upload failed")
                    setUploadState("error")
                },
                onProgress: (bytesUploaded, bytesTotal) => {
                    const percentage = Math.round((bytesUploaded / bytesTotal) * 100)
                    setProgress(percentage)
                    console.log(`Upload progress: ${percentage}% (${bytesUploaded}/${bytesTotal})`)
                },
                onSuccess: async () => {
                    console.log("TUS onSuccess fired! Video ID:", newVideoId)
                    try {
                        // Step 3: Update the block with the video ID
                        await updateBlock(blockId, { videoId: newVideoId })
                        console.log("Block updated successfully")

                        setVideoId(newVideoId)
                        setUploadState("complete")
                        onUploadComplete?.(newVideoId)
                    } catch (updateError) {
                        console.error("Error updating block:", updateError)
                        setError("Upload succeeded but failed to save to database")
                        setUploadState("error")
                    }
                },
                onAfterResponse: (req, res) => {
                    console.log("TUS Response:", res.getStatus(), res.getHeader("Upload-Offset"))
                },
            })

            uploadRef.current = upload
            upload.start()

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

    // Show video player if we have a video ID
    if (videoId && uploadState !== "uploading" && bunnyLibraryId) {
        return (
            <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-daw-purple/30 shadow-lg shadow-daw-purple/10">
                    <iframe
                        src={`https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${videoId}?autoplay=false&preload=true`}
                        title="Video Player"
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                <button
                    onClick={handleClick}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-dashed border-border hover:border-daw-purple hover:text-daw-purple transition-colors text-sm text-muted-foreground"
                >
                    <Upload className="w-4 h-4" />
                    Replace Video
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleInputChange}
                    className="hidden"
                />
            </div>
        )
    }

    return (
        <div
            onClick={uploadState === "idle" || uploadState === "error" ? handleClick : undefined}
            onDrop={uploadState === "idle" ? handleDrop : undefined}
            onDragOver={handleDragOver}
            className={cn(
                "relative aspect-video rounded-lg overflow-hidden border-2 border-dashed transition-all cursor-pointer",
                uploadState === "idle" && "border-border/50 hover:border-daw-purple/50 bg-secondary/50",
                uploadState === "signing" && "border-daw-purple/30 bg-daw-purple/5",
                uploadState === "uploading" && "border-daw-purple/50 bg-daw-purple/5",
                uploadState === "complete" && "border-green-500/50 bg-green-500/5",
                uploadState === "error" && "border-red-500/50 bg-red-500/5",
            )}
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {uploadState === "idle" && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-daw-purple/20 border border-daw-purple/30 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-daw-purple" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-foreground font-medium">Drop video here or click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">MP4, MOV, WebM up to 5GB</p>
                        </div>
                    </>
                )}

                {uploadState === "signing" && (
                    <>
                        <Loader2 className="w-10 h-10 text-daw-purple animate-spin" />
                        <p className="text-sm text-muted-foreground">Preparing upload...</p>
                    </>
                )}

                {uploadState === "uploading" && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-daw-purple/20 border border-daw-purple/30 flex items-center justify-center relative">
                            <Video className="w-6 h-6 text-daw-purple" />
                            <svg className="absolute inset-0" viewBox="0 0 64 64">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    className="text-daw-purple/20"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    className="text-daw-purple"
                                    strokeDasharray={175.93}
                                    strokeDashoffset={175.93 * (1 - progress / 100)}
                                    transform="rotate(-90 32 32)"
                                />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-daw-purple">{progress}%</p>
                            <p className="text-xs text-muted-foreground">Uploading to Bunny.net...</p>
                        </div>
                    </>
                )}

                {uploadState === "complete" && (
                    <>
                        <CheckCircle className="w-10 h-10 text-green-500" />
                        <p className="text-sm text-green-500 font-medium">Upload complete!</p>
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
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-daw-purple/40" />
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-daw-purple/40" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-daw-purple/40" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-daw-purple/40" />

            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleInputChange}
                className="hidden"
            />
        </div>
    )
}
