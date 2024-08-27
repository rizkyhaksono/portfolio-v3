import Image from "next/image"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, GitBranch } from "lucide-react";

export default function CardProject({
  title,
  description,
  links,
  image,
  href,
  className,
}: Readonly<{
  title: string
  description: string
  links?: { type: string; href: string; icon: React.ReactNode }[]
  image?: string
  href?: string
  className?: string
}>) {
  return (
    <Card className="flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full">
      <Link
        href={href ?? "#"}
        className={cn("block cursor-pointer", className)}
      >
        {image && (
          <Image
            src={image}
            alt={title}
            width={500}
            height={300}
            className="h-40 w-full overflow-hidden object-cover object-top"
          />
        )}
      </Link>
      <CardHeader className="px-2">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-base font-bold">{title}</CardTitle>
          {/* <time className="font-sans text-xs">{new Date(created_at).toLocaleDateString()}</time> */}
          <div
            className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-2">
        {/* {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge className="px-1 py-0 text-[10px]" variant="secondary" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        )} */}
      </CardContent>
      <CardFooter className="px-2">
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links.map((link, idx) => (
              <Link href={link.href} key={idx} target="_blank">
                <Badge className="flex gap-2 px-2 py-1 text-[10px]">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
        <div className="flex flex-row gap-2">
          <Button size={"sm"} className="gap-2">
            <Globe className="text-muted size-4" /> Website
          </Button>
          <Button size={"sm"} className="gap-2">
            <GitBranch className="text-muted size-4" /> Source
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
