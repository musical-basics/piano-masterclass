import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"

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

        // Step 1: Create a new video in Bunny.net library
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
        const videoId = data.guid

        // Step 2: Generate presigned signature for TUS upload
        // Signature = SHA256(library_id + api_key + expiration_time + video_id)
        const expirationTime = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now

        const signatureString = `${libraryId}${apiKey}${expirationTime}${videoId}`
        const signature = createHash("sha256").update(signatureString).digest("hex")

        // Return the video info and upload credentials
        return NextResponse.json({
            videoId: videoId,
            libraryId: libraryId,
            authorizationSignature: signature,
            authorizationExpire: expirationTime,
            uploadUrl: `https://video.bunnycdn.com/tusupload`,
        })
    } catch (error) {
        console.error("Error creating Bunny video:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
