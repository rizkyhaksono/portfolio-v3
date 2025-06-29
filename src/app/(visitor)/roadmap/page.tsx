'use client';

import { roadmaps_data } from '@/commons/constants/roadmap';
import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckCircle, ChevronRight, Clock, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState } from 'react';

const LEVEL_BADGES = {
  beginner: {
    color: "bg-green-500/20 hover:bg-green-500/30 text-green-500 dark:hover:bg-green-800/20"
  },
  intermediate: {
    color: "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 dark:hover:bg-yellow-800/20"
  },
  advanced: {
    color: "bg-red-500/20 hover:bg-red-500/30 text-red-500 dark:hover:bg-red-800/20"
  }
};

export default function CourseRoadmap() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", ...new Set(roadmaps_data.map(roadmap => roadmap.category))];

  const filteredCourses = roadmaps_data.filter(roadmap =>
    activeCategory === "all" || roadmap.category === activeCategory
  );

  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center mb-6">
        <p className="text-center text-xl font-semibold">Learning Roadmap</p>
        <div className="mt-2 text-sm text-muted-foreground">
          Follow these structured courses to build your skills systematically.
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800 mb-4">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Disclaimer:</strong> {`Under development....`}
          </p>
        </CardContent>
      </Card>

      {/* Category filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div className="space-y-8">
        {filteredCourses.map(course => (
          <Card key={course.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    {course.title}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={LEVEL_BADGES[course.level].color}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {course.category}
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm text-muted-foreground block">
                    {course.completedRoadmap ?? 0} / {course.totalRoadmap} lessons
                  </span>
                  {(course.completedRoadmap ?? 0) > 0 && (
                    <div className="mt-1 w-32">
                      <Progress value={(course.completedRoadmap ?? 0) / course.totalRoadmap * 100} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
              <CardDescription className="mt-3">{course.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue={course.modules[0].id} className="mt-2">
                <TabsList className="mb-4">
                  {course.modules.map(module => (
                    <TabsTrigger key={module.id} value={module.id}>
                      {module.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {course.modules.map(module => (
                  <TabsContent key={module.id} value={module.id}>
                    <div className="space-y-1 mb-4">
                      <h3 className="text-lg font-medium">{module.title}</h3>
                      <p className="text-muted-foreground text-sm">{module.description}</p>
                      <p className="text-xs text-muted-foreground">{module.duration}</p>
                    </div>

                    <div className="space-y-2">
                      {module.roadmaps.map(roadmap => (
                        <Link
                          key={roadmap.id}
                          href={`/roadmap/${course.id}/${roadmap.slug}`}
                          className="block"
                        >
                          <Card className="hover:border-primary/50 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex gap-3 items-center">
                                {roadmap.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <BookOpen className="h-5 w-5" />
                                )}
                                <div>
                                  <h4 className="font-medium">{roadmap.title}</h4>
                                  <p className="text-sm text-muted-foreground">{roadmap.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {roadmap.duration}
                                </span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>

            <CardFooter className="border-t pt-4">
              <Button asChild>
                <Link href={`/roadmap/${course.id}`}>View Full Course</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </BlurFade>
  );
}