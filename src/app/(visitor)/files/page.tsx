'use client';

import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Search, Code, Image, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

const FILES_DATA = {
  documents: [
    {
      id: "doc-1",
      title: "Portfolio Style Guide",
      description: "Design system documentation for my portfolio website",
      fileType: "PDF",
      fileSize: "2.4 MB",
      date: "2023-09-12",
      downloadUrl: "/files/portfolio-style-guide.pdf",
      icon: FileText,
      tags: ["design", "documentation"]
    },
    {
      id: "doc-2",
      title: "Resume / CV",
      description: "My professional resume with work history and skills",
      fileType: "PDF",
      fileSize: "1.2 MB",
      date: "2023-11-05",
      downloadUrl: "/files/resume.pdf",
      icon: FileText,
      tags: ["professional", "resume"]
    }
  ],
  code: [
    {
      id: "code-1",
      title: "React Custom Hooks Collection",
      description: "A set of useful custom React hooks I've created",
      fileType: "ZIP",
      fileSize: "156 KB",
      date: "2023-07-22",
      downloadUrl: "/files/react-hooks.zip",
      icon: Code,
      tags: ["react", "javascript", "hooks"]
    },
    {
      id: "code-2",
      title: "CSS Animation Library",
      description: "Collection of reusable CSS animations and transitions",
      fileType: "ZIP",
      fileSize: "98 KB",
      date: "2023-08-15",
      downloadUrl: "/files/css-animations.zip",
      icon: Code,
      tags: ["css", "animations", "frontend"]
    }
  ],
  design: [
    {
      id: "design-1",
      title: "UI Component Library",
      description: "Figma file with my custom UI component designs",
      fileType: "Figma",
      fileSize: "8.2 MB",
      date: "2023-10-03",
      downloadUrl: "/files/ui-components.fig",
      icon: Image,
      tags: ["ui", "figma", "design-system"]
    },
    {
      id: "design-2",
      title: "Icon Pack",
      description: "Set of 50+ custom SVG icons I designed",
      fileType: "SVG",
      fileSize: "2.8 MB",
      date: "2023-06-18",
      downloadUrl: "/files/icon-pack.zip",
      icon: Image,
      tags: ["icons", "svg", "design"]
    }
  ],
  other: [
    {
      id: "other-1",
      title: "Project Timeline Template",
      description: "Excel template for planning project timelines",
      fileType: "XLSX",
      fileSize: "345 KB",
      date: "2023-05-29",
      downloadUrl: "/files/project-timeline.xlsx",
      icon: FileSpreadsheet,
      tags: ["productivity", "project-management"]
    }
  ]
};

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = Object.keys(FILES_DATA);

  const filteredFiles = Object.entries(FILES_DATA).flatMap(([category, files]) => {
    return files.filter(file => {
      const matchesSearch =
        file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = activeCategory === "all" || category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  });

  const handleDownload = (file: typeof FILES_DATA[keyof typeof FILES_DATA][number]) => {
    console.log(`Downloading file: ${file.title}`);
  };

  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center mb-6">
        <p className="text-center text-xl font-semibold">Files</p>
        <div className="mt-2 text-sm text-muted-foreground">
          {`Downloadable resources, templates, and assets I've created that you might find useful.`}
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

      {/* Search area */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category tabs */}
      <Tabs
        defaultValue="all"
        className="mb-8 text-center"
        onValueChange={(value) => setActiveCategory(value)}
      >
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Files display */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredFiles.length > 0 ? (
          filteredFiles.map(file => {
            const Icon = file.icon;

            return (
              <Card key={file.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-secondary p-2">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{file.title}</CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{file.fileType}</span>
                        <span>•</span>
                        <span>{file.fileSize}</span>
                        <span>•</span>
                        <span>{file.date}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{file.description}</CardDescription>
                  <div className="flex gap-2 flex-wrap mt-3">
                    {file.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    onClick={(e) => handleDownload(file)}
                  >
                    <a href={file.downloadUrl} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-10 col-span-2">
            <p className="text-muted-foreground">No files match your search criteria.</p>
          </div>
        )}
      </div>
    </BlurFade>
  );
}