import { notFound } from "next/navigation";
import { getRoadmapLessonBySlug, getAllRoadmapLessons } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getMDXComponents } from "@/components/ui/roadmap-mdx-component";
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RoadmapLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getRoadmapLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const { meta, content } = lesson;
  const components = getMDXComponents();

  return (
    <div className="container max-w-4xl py-8">
      <Link href="/roadmap">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="size-4" />
          Back to Roadmap
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          {meta.difficulty && (
            <Badge variant="outline" className="capitalize">
              {meta.difficulty}
            </Badge>
          )}
          {meta.category && (
            <Badge variant="secondary">{meta.category}</Badge>
          )}
        </div>

        <h1 className="text-4xl font-bold tracking-tight">{meta.title}</h1>

        {meta.description && (
          <p className="text-xl text-muted-foreground">{meta.description}</p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {meta.course && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="capitalize">
                {meta.course.replace(/-/g, " ")}
              </span>
            </div>
          )}
          {meta.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{meta.duration}</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Embed */}
      {meta.video && (
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={meta.video}
                title={meta.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Illustration */}
      {meta.illustration && (
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={meta.illustration}
                alt={meta.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* MDX Content */}
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote source={content} components={components} />
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const lessons = getAllRoadmapLessons();
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getRoadmapLessonBySlug(slug);

  if (!lesson) {
    return {
      title: "Lesson Not Found",
    };
  }

  const { meta } = lesson;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      images: meta.illustration
        ? [{ url: meta.illustration }]
        : [],
    },
  };
}
