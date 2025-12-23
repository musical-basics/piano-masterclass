"use client"

import { useState } from "react"
import { Play, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-zinc-950">
        {/* Purple/Cyan gradient mesh like concert stage */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#7c3aed]/30 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#06b6d4]/25 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-[#7c3aed]/20 rounded-full blur-[100px]" />
        </div>
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-daw-purple/10 border border-daw-purple/30">
              <Volume2 className="w-4 h-4 text-daw-purple" />
              <span className="text-sm font-medium text-daw-purple">New Course Available</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
              <span className="text-foreground">Master the Piano</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] glow-text-purple">
                from Zero to Hero.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              The definitive guide to modern piano technique. Learn from professional musicians and unlock your creative
              potential.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-white px-8 py-6 text-lg font-semibold glow-purple transition-all hover:scale-105"
              >
                Start Learning Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/50 text-foreground hover:bg-secondary/50 px-8 py-6 text-lg bg-transparent"
              >
                View Curriculum
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">2,400+ students enrolled</p>
                <p className="text-xs text-muted-foreground">Join the community</p>
              </div>
            </div>
          </div>

          {/* Right: Video Player */}
          <div className="relative">
            {/* Glassmorphism container */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm p-2">
              {/* Inner video container */}
              <div
                className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 cursor-pointer group"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {/* Placeholder thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <img
                    src="/piano-keys-dramatic-lighting-concert-stage-purple-.jpg"
                    alt="Course trailer thumbnail"
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>

                {/* Play button overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#7c3aed] flex items-center justify-center glow-purple transition-transform group-hover:scale-110">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>
                )}

                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-daw-purple/60" />
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-daw-purple/60" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-daw-cyan/60" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-daw-cyan/60" />

                {/* Duration badge */}
                <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/70 backdrop-blur-sm">
                  <span className="font-mono text-xs text-white">2:34</span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 -top-4 -right-4 w-full h-full rounded-2xl border border-daw-purple/20" />
            <div className="absolute -z-20 -top-8 -right-8 w-full h-full rounded-2xl border border-daw-cyan/10" />
          </div>
        </div>
      </div>
    </section>
  )
}
