import { put } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            )
        }

        // Validate file type
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Only PDF files are allowed" },
                { status: 400 }
            )
        }

        // Upload to Vercel Blob
        const blob = await put(`pdfs/${Date.now()}-${file.name}`, file, {
            access: "public",
            contentType: "application/pdf",
        })

        return NextResponse.json({
            url: blob.url,
            filename: file.name,
            size: file.size,
        })
    } catch (error) {
        console.error("Error uploading PDF:", error)
        return NextResponse.json(
            { error: "Failed to upload PDF" },
            { status: 500 }
        )
    }
}
