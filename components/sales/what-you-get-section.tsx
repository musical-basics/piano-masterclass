import { Play, Music, Users } from "lucide-react"

const features = [
    {
        icon: Play,
        title: "50+ Video Lessons",
        description: "HD quality tutorials covering everything from basics to advanced techniques.",
        color: "text-daw-purple",
        bgColor: "bg-daw-purple/10",
        borderColor: "border-daw-purple/30",
        glowClass: "glow-purple",
    },
    {
        icon: Music,
        title: "Interactive Sheet Music",
        description: "Follow along with synchronized notation that highlights as you play.",
        color: "text-daw-cyan",
        bgColor: "bg-daw-cyan/10",
        borderColor: "border-daw-cyan/30",
        glowClass: "glow-cyan",
    },
    {
        icon: Users,
        title: "Community Feedback",
        description: "Get personalized feedback from instructors and connect with fellow students.",
        color: "text-daw-purple",
        bgColor: "bg-daw-purple/10",
        borderColor: "border-daw-purple/30",
        glowClass: "glow-purple",
    },
]

export function WhatYouGetSection() {
    return (
        <section className="py-24 bg-zinc-950 relative">
            {/* Subtle background accent */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#7c3aed]/10 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Succeed</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A complete learning experience designed for aspiring musicians
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group relative rounded-xl bg-zinc-900 border ${feature.borderColor} p-8 transition-all hover:border-opacity-60`}
                        >
                            {/* Icon */}
                            <div
                                className={`w-14 h-14 rounded-xl ${feature.bgColor} border ${feature.borderColor} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                            >
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                            {/* Decorative corner */}
                            <div className={`absolute top-4 right-4 w-8 h-8 border-r border-t ${feature.borderColor} opacity-40`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
