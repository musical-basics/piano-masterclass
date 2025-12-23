import { HeroSection } from "@/components/sales/hero-section"
import { WhatYouGetSection } from "@/components/sales/what-you-get-section"
import { CurriculumPreview } from "@/components/sales/curriculum-preview"
import { PricingSection } from "@/components/sales/pricing-section"
import { SalesFooter } from "@/components/sales/sales-footer"

export default function CourseSalesPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <WhatYouGetSection />
      <CurriculumPreview />
      <PricingSection />
      <SalesFooter />
    </main>
  )
}
