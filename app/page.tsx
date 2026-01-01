import { db } from "@/db"
import { courses, sections, lessons, pricingPlans } from "@/db/schema"
import { eq } from "drizzle-orm"
import { HeroSection } from "@/components/sales/hero-section"
import { WhatYouGetSection } from "@/components/sales/what-you-get-section"
import { CurriculumPreview } from "@/components/sales/curriculum-preview"
import { PricingSection } from "@/components/sales/pricing-section"
import { SalesFooter } from "@/components/sales/sales-footer"

export default async function SalesPage() {
  const bunnyLibraryId = process.env.BUNNY_LIBRARY_ID || ""

  // Fetch course data
  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true))
    .limit(1)
    .then(rows => rows[0])

  if (!course) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No published course found.</p>
      </main>
    )
  }

  // Fetch pricing plans for this course
  const plans = await db
    .select()
    .from(pricingPlans)
    .where(eq(pricingPlans.courseId, course.id))

  // Fetch sections with lessons for this course
  const sectionsData = await db
    .select()
    .from(sections)
    .where(eq(sections.courseId, course.id))
    .orderBy(sections.order)

  // For each section, fetch its lessons
  const sectionsWithLessons = await Promise.all(
    sectionsData.map(async (section) => {
      const sectionLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.sectionId, section.id))
        .orderBy(lessons.order)

      return {
        id: section.id,
        title: section.title,
        lessons: sectionLessons.map((l) => ({
          id: l.id,
          title: l.title,
        })),
      }
    })
  )

  // Find first video content block for hero trailer (optional)
  // For now, we'll use a hardcoded trailer video ID - this can be expanded later
  const trailerVideoId = "5806a65e-42b2-430d-b191-f569a91e27ce"

  // Map pricing plans to the format expected by PricingSection
  const formattedPlans = plans.map((plan) => ({
    id: plan.id,
    title: plan.title,
    price: plan.price,
    currency: plan.currency,
    features: plan.features as string[],
    isPopular: plan.isPopular ?? false,
  }))

  // Get the first lesson ID for the Studio link
  const firstLessonId = sectionsWithLessons[0]?.lessons[0]?.id || ""

  return (
    <main className="min-h-screen bg-background relative">
      <HeroSection videoId={trailerVideoId} bunnyLibraryId={bunnyLibraryId} />
      <WhatYouGetSection />
      <CurriculumPreview sections={sectionsWithLessons} />
      <PricingSection plans={formattedPlans} />
      <SalesFooter />
    </main>
  )
}
