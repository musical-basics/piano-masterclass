import Link from "next/link"

export function DebugNav({ firstLessonId }: { firstLessonId: string }) {
    return (
        <div className="w-full bg-slate-950 border-b border-slate-800 p-2 flex justify-end gap-2 z-[100] relative">
            <Link
                href="/"
                className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-white rounded hover:bg-gray-800 text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
                Home
            </Link>
            <Link
                href="/admin"
                className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-white rounded hover:bg-gray-800 text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
                Admin
            </Link>
            <Link
                href={firstLessonId ? `/studio?lessonId=${firstLessonId}` : "/admin"}
                className="px-3 py-1.5 bg-daw-purple border border-daw-purple/50 text-white rounded hover:bg-daw-purple/90 text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
                Studio
            </Link>
            <Link
                href="/learn"
                className="px-3 py-1.5 bg-daw-cyan border border-daw-cyan/50 text-white rounded hover:bg-daw-cyan/90 text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
                Learn
            </Link>
        </div>
    )
}
