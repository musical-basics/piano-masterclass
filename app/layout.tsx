import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

import { db } from "@/db"
import { lessons } from "@/db/schema"
import { asc } from "drizzle-orm"
import { DebugNav } from "@/components/debug-nav"

export const metadata: Metadata = {
  title: "Music Course Studio | DAW Dashboard",
  description: "High-tech music production curriculum editor",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch the first lesson for fixed navigation
  const [firstLesson] = await db
    .select()
    .from(lessons)
    .orderBy(asc(lessons.order))
    .limit(1)

  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <DebugNav firstLessonId={firstLesson?.id || ""} />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
