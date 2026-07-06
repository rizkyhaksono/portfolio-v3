import BlurFade from "@/components/magicui/blur-fade"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Chip } from "@/components/ui/chip"
import { getSupabaseProjectById } from "@/services/visitor/project"
import ClapButton from "@/components/ui/clap-button"
import { ArrowLeft, Calendar, Globe, GitBranch, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import ProjectImageViewer from "./_components/project-image-viewer"

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: Readonly<Props>) {
  const { id } = await params
  const project = await getSupabaseProjectById(id)

  if (!project) return notFound()

  return (
    <BlurFade delay={0.25} inView>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link href="/project">
          <Button variant="ghost" size="sm" className="mb-6 gap-2">
            <ArrowLeft className="size-4" />
            Back to Projects
          </Button>
        </Link>

        {/* Project Header */}
        <div className="mb-8">
          <SectionHeading as="h1" eyebrow="Project" title={project.title} className="mb-4" />
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>
                Created:{" "}
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {project.updated_at && project.updated_at !== project.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>
                  Updated:{" "}
                  {new Date(project.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          <ClapButton targetType="project" targetId={id} className="mb-6" />

          {/* Project Image — click to view uncropped in a lightbox */}
          {project.image && <ProjectImageViewer src={project.image} alt={project.title} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Eyebrow>Project Description</Eyebrow>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: project.description }} />
              </CardContent>
            </Card>

            {/* Technologies Section */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
                <CardDescription>Tech stack and tools for this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Note: Technology tags will be available once the database schema is updated.
                </p>
              </CardContent>
            </Card> */}

            {/* Project Timeline */}
            <Card>
              <CardHeader>
                <Eyebrow>Project Timeline</Eyebrow>
                <CardDescription className="text-xs sm:text-sm">Development milestones and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="size-2 rounded-full bg-primary" />
                      <div className="w-px h-full bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Project Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {project.updated_at && project.updated_at !== project.created_at && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="size-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.updated_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Eyebrow>Quick Links</Eyebrow>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.url && (
                  <Link href={project.url} target="_blank" className="block">
                    <Button className="w-full gap-2" variant="default">
                      <Globe className="size-4" />
                      Visit Website
                      <ExternalLink className="size-3 ml-auto" />
                    </Button>
                  </Link>
                )}
                {project.source_code && (
                  <Link href={project.source_code} target="_blank" className="block">
                    <Button className="w-full gap-2" variant="outline">
                      <GitBranch className="size-4" />
                      Source Code
                      <ExternalLink className="size-3 ml-auto" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Eyebrow>Project Info</Eyebrow>
              </CardHeader>
              <CardContent>
                <div>
                  <Eyebrow className="mb-2">Status</Eyebrow>
                  <Chip className="border-primary/30 bg-primary/10 text-primary">Active</Chip>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BlurFade>
  )
}
