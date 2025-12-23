interface VideoPlayerProps {
    videoId: string
    title?: string
    libraryId: string
}

export function VideoPlayer({ videoId, title, libraryId }: VideoPlayerProps) {
    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&preload=true`

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-daw-purple/30 shadow-lg shadow-daw-purple/10">
            {/* Purple glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-daw-purple/5 to-daw-cyan/5 pointer-events-none z-10" />

            <iframe
                src={embedUrl}
                title={title || "Video Player"}
                className="absolute inset-0 w-full h-full"
                loading="lazy"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
            />
        </div>
    )
}
