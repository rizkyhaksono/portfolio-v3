"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import type { RoadmapContent } from "@/lib/mdx";

interface CourseGroup {
  course: string;
  lessons: RoadmapContent[];
}

interface RoadmapClientProps {
  courses: CourseGroup[];
}

export function RoadmapClient({ courses }: RoadmapClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const allCategories = ["All", ...Array.from(new Set(courses.flatMap(({ lessons }) => lessons.map(l => l.meta.category))))];

  const filteredCourses = selectedCategory === "All"
    ? courses
    : courses.map(({ course, lessons }) => ({
      course,
      lessons: lessons.filter(l => l.meta.category === selectedCategory)
    })).filter(({ lessons }) => lessons.length > 0);

  const formatCourseName = (course: string | undefined) => {
    if (!course) return "Untitled";
    return course
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-8 py-8">
      {allCategories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category, idx) => (
            <Badge
              key={`${category}-${idx}`}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-12">
        {filteredCourses.map(({ course, lessons }, courseIndex) => (
          <div key={`course-${course}-${courseIndex}`} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-2xl font-semibold tracking-tight">
                {formatCourseName(course)}
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/roadmap/${lesson.slug}`}
                  className="group"
                >
                  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-wrap gap-2">
                          {lesson.meta.difficulty && (
                            <Badge variant="outline" className="capitalize">
                              {lesson.meta.difficulty}
                            </Badge>
                          )}
                          {lesson.meta.category && (
                            <Badge variant="secondary" className="capitalize">
                              {lesson.meta.category}
                            </Badge>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="line-clamp-2">{lesson.meta.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {lesson.meta.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {lesson.meta.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{lesson.meta.duration}</span>
                          </div>
                        )}
                        {lesson.meta.video && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>Video</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No lessons found for this category.</p>
        </div>
      )}
    </div>
  );
}
