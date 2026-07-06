"use client"

import { LinkedinRecommendation } from "@/commons/types/linkedin"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { SectionHeading } from "@/components/ui/section-heading"

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
      <SectionHeading
        eyebrow="Testimonials"
        title="What people say"
        accent="about me"
        description="Testimonials from colleagues and professionals I've worked with on LinkedIn."
        className="mb-6"
      />
      <InfiniteMovingCards items={formattedRecommendations} direction="left" speed="normal" pauseOnHover={false} />
    </div>
  )
}
