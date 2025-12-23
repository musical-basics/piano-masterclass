import { getCourseData } from "@/lib/data"
import { LearnClient } from "@/components/learn-client"

export default async function LearnPage() {
  const course = await getCourseData()

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">No Course Found</h1>
          <p className="text-muted-foreground">Please run the seed script to add course data.</p>
        </div>
      </div>
    )
  }

  return <LearnClient course={course} />
}

