"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onSave: () => void
  isSaving: boolean
}

export function Header({ onSave, isSaving }: HeaderProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    if (!isSaving && lastSaved === null) {
      setLastSaved(new Date())
    }
  }, [isSaving, lastSaved])

  const handleSave = () => {
    onSave()
    setTimeout(() => setLastSaved(new Date()), 1500)
  }

  return (
    <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-40">
      {/* Logo - Updated to DAW theme with headphones icon */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-daw-purple/10 border border-daw-purple/30 flex items-center justify-center">
          <Headphones className="w-4 h-4 text-daw-purple" />
        </div>
        <span className="text-sm font-semibold tracking-tight">
          <span className="text-daw-purple">STUDIO</span>
          <span className="text-muted-foreground">.COURSE</span>
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {lastSaved && !isSaving && (
          <span className="text-xs font-mono text-muted-foreground">Last saved: {lastSaved.toLocaleTimeString()}</span>
        )}

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-daw-purple/10 hover:bg-daw-purple/20 text-daw-purple border border-daw-purple/30 hover:border-daw-purple/50 text-xs font-medium transition-all hover:glow-purple"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </header>
  )
}
