import Image from "next/image"
import Link from "next/link"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Globe, GitBranch } from "lucide-react";

export default function CardProject({
  title,
  description,
  source,
  image,
  href,
}: Readonly<{
  title: string
  description: string
  source?: string,
  image?: string
  href?: string
}>) {
  return (
    <Card className="flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full">
      {image && (
        <Image
          src={image}
          alt={title}
          width={500}
          height={300}
          className="h-40 w-full overflow-hidden object-cover object-top"
        />
      )}
      <CardHeader className="px-2">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-base font-bold">{title}</CardTitle>
          <div
            className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert pt-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </CardHeader>
      <CardFooter className="px-2">
        <div className="flex flex-row flex-wrap items-start gap-2">
          {href && href.length > 0 && (
            <Link href={href} target="_blank">
              <Button size={"sm"} className="gap-1">
                <Globe className="text-muted size-4" /> Website
              </Button>
            </Link>
          )}
          {source && source.length > 0 && (
            <Link href={source} target="_blank">
              <Button size={"sm"} className="gap-1">
                <GitBranch className="text-muted size-4" /> Source
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
