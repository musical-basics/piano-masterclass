import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { title } = await request.json()

        if (!title || typeof title !== "string") {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            )
        }

        const libraryId = process.env.BUNNY_LIBRARY_ID
        const apiKey = process.env.BUNNY_API_KEY

        if (!libraryId || !apiKey) {
            return NextResponse.json(
                { error: "Bunny.net credentials not configured" },
                { status: 500 }
            )
        }

        // Create a new video in Bunny.net library
        const response = await fetch(
            `https://video.bunnycdn.com/library/${libraryId}/videos`,
            {
                method: "POST",
                headers: {
                    "AccessKey": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Bunny.net API error:", errorText)
            return NextResponse.json(
                { error: "Failed to create video in Bunny.net" },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Return the video GUID and auth signature for direct upload
        return NextResponse.json({
            videoId: data.guid,
            libraryId: libraryId,
            // The signature is used for TUS upload authentication
            // For TUS uploads, you need the video GUID and library ID
            // The actual upload URL is: https://video.bunnycdn.com/tusupload
            uploadUrl: `https://video.bunnycdn.com/tusupload`,
            expirationTime: Date.now() + 3600000, // 1 hour from now
        })
    } catch (error) {
        console.error("Error creating Bunny video:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
