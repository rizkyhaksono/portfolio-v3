'use client';

import BlurFade from "@/components/magicui/blur-fade";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NOTES_DATA = {
  development: [
    {
      id: "dev-1",
      title: "Setting Up Next.js with TypeScript",
      summary: "Steps to create a new Next.js project with TypeScript configuration",
      date: "2023-06-15",
      tags: ["nextjs", "typescript", "setup"]
    },
    {
      id: "dev-2",
      title: "React Server Components",
      summary: "Understanding the differences between server and client components in Next.js 13+",
      date: "2023-08-22",
      tags: ["react", "nextjs", "server-components"]
    },
    {
      id: "dev-3",
      title: "Optimizing Images in Next.js",
      summary: "Best practices for image optimization using Next.js Image component",
      date: "2023-09-05",
      tags: ["nextjs", "performance", "images"]
    }
  ],
  design: [
    {
      id: "design-1",
      title: "Color Theory Basics",
      summary: "Understanding color relationships and creating harmonious palettes",
      date: "2023-05-10",
      tags: ["design", "colors", "theory"]
    },
    {
      id: "design-2",
      title: "Responsive Design Patterns",
      summary: "Common patterns for creating layouts that work across all device sizes",
      date: "2023-07-18",
      tags: ["responsive", "css", "layout"]
    }
  ],
  productivity: [
    {
      id: "prod-1",
      title: "Time Blocking Method",
      summary: "How to use time blocking to improve focus and productivity",
      date: "2023-04-22",
      tags: ["productivity", "time-management", "focus"]
    },
    {
      id: "prod-2",
      title: "Setting Up a Personal Knowledge Base",
      summary: "Tools and methods for organizing personal notes and information",
      date: "2023-08-01",
      tags: ["organization", "notes", "tools"]
    }
  ]
};

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter notes based on search query and active category
  const filteredNotes = Object.entries(NOTES_DATA).flatMap(([category, notes]) => {
    return notes.filter(note => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = activeCategory === "all" || category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  });

  return (
    <BlurFade delay={0.25} inView>
      <div className="container max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-2">Notes</h1>
        <p className="text-muted-foreground mb-8">
          {`Collection of thoughts, learnings, and reference materials I've compiled over time.`}
        </p>

        {/* Search and filter area */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category tabs */}
        <Tabs
          defaultValue="all"
          className="mb-8"
          onValueChange={(value) => setActiveCategory(value)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notes display */}
        <div className="space-y-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <Link href={`/notes/${note.id}`} key={note.id} className="block transition-all hover:translate-x-1">
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>{note.title}</CardTitle>
                      <span className="text-sm text-muted-foreground">{note.date}</span>
                    </div>
                    <CardDescription className="mt-1">{note.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      {note.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No notes match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </BlurFade>
  );
}