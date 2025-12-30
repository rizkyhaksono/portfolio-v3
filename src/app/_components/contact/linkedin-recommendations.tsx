"use client"

import { LinkedinRecommendation } from "@/commons/types/linkedin"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

interface LinkedinRecommendationsProps {
  recommendations: LinkedinRecommendation[]
}

export default function LinkedinRecommendations({ recommendations }: LinkedinRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return null
  }

  const formattedRecommendations = recommendations.map((rec) => ({
    quote: rec.message,
    name: rec.name,
    title: "",
    image: rec.image,
  }))

  return (
    <div className="my-10">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-xl font-semibold">What People Say About Me</h2>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">Testimonials from colleagues and professionals I&apos;ve worked with on LinkedIn.</p>
      <div className="">
        <InfiniteMovingCards items={formattedRecommendations} direction="left" speed="normal" pauseOnHover={false} />
      </div>
    </div>
  )
}
