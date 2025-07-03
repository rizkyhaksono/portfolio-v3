"use client"

import { Badge } from "@/components/ui/badge"
import Marquee from "@/components/magicui/marquee";
import BlurFade from "@/components/magicui/blur-fade";
import {
  skills_data,
  skills_data_top,
  skills_data_bottom,
  getRandomSkills,
  skillsStats
} from "@/commons/constants/skills";
import Typography from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SkillSection() {
  const [showDetailed, setShowDetailed] = useState(false);

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <div className="flex items-center self-center justify-between mb-6">
          <Typography.P className="text-left text-xl font-semibold">
            Skills<span className="text-sm font-normal text-muted-foreground ml-2">
              ({skillsStats.totalSkills} skills across {skillsStats.totalCategories} categories)
            </span>
          </Typography.P>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailed(!showDetailed)}
            className="flex items-center gap-2"
          >
            {showDetailed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showDetailed ? 'Show Less' : 'Show All'}
          </Button>
        </div>

        {/* Marquee Display */}
        <div className="relative w-full flex-col mb-8">
          <Marquee className="[--duration:25s]">
            {skills_data_top.map((skill) => (
              <Badge key={skill} variant="secondary" className="mx-1">
                {skill}
              </Badge>
            ))}
          </Marquee>
          <Marquee reverse className="[--duration:25s]">
            {skills_data_bottom.map((skill) => (
              <Badge key={skill} variant="secondary" className="mx-1">
                {skill}
              </Badge>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>

        {/* Detailed Skills Display */}
        {showDetailed && (
          <BlurFade delay={0.1} inView>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills_data.map((category, index) => (
                <BlurFade key={category.name} delay={0.1 + index * 0.05} inView>
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {category.name}
                        <Badge variant="secondary" className="text-xs">
                          {category.skills.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>

            {/* Skills Statistics */}
            <BlurFade delay={0.4} inView>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Skills Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{skillsStats.totalSkills}</div>
                      <div className="text-sm text-muted-foreground">Total Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{skillsStats.totalCategories}</div>
                      <div className="text-sm text-muted-foreground">Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{skillsStats.averageSkillsPerCategory}</div>
                      <div className="text-sm text-muted-foreground">Avg per Category</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {skills_data.find(cat => cat.name === skillsStats.categoryWithMostSkills)?.skills.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Most Skills
                        <br />
                        <span className="text-xs">({skillsStats.categoryWithMostSkills})</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          </BlurFade>
        )}
      </div>
    </BlurFade>
  )
}