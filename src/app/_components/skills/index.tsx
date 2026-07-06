"use client"

import Marquee from "@/components/magicui/marquee"
import BlurFade from "@/components/magicui/blur-fade"
import { skills_data, skills_data_top, skills_data_bottom, skillsStats } from "@/commons/constants/skills"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { Chip } from "@/components/ui/chip"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function SkillSection() {
  const [showDetailed, setShowDetailed] = useState(false)

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <SectionHeading
            eyebrow="Toolkit"
            title="Skills"
            accent="& stack"
            description={`${skillsStats.totalSkills} skills across ${skillsStats.totalCategories} categories.`}
          />
          <Button variant="outline" size="sm" onClick={() => setShowDetailed(!showDetailed)} className="flex shrink-0 items-center gap-2">
            {showDetailed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showDetailed ? "Show Less" : "Show All"}
          </Button>
        </div>

        {/* Marquee Display */}
        <div className="relative w-full flex-col mb-8">
          <Marquee className="[--duration:25s]">
            {skills_data_top.map((skill) => (
              <Chip key={skill} className="mx-1">
                {skill}
              </Chip>
            ))}
          </Marquee>
          <Marquee reverse className="[--duration:25s]">
            {skills_data_bottom.map((skill) => (
              <Chip key={skill} className="mx-1">
                {skill}
              </Chip>
            ))}
          </Marquee>
        </div>

        {/* Detailed Skills Display - No nested BlurFade per card */}
        {showDetailed && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 animate-fade-in-up">
            {skills_data.map((category) => (
              <Card key={category.name} className="h-full hover:border-foreground/20">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="flex items-center justify-between gap-2 font-display text-sm font-bold tracking-tight">
                    {category.name}
                    <Chip>{category.skills.length}</Chip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill) => (
                      <Chip key={skill}>{skill}</Chip>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BlurFade>
  )
}
