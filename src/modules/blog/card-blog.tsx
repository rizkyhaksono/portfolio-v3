import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigRightDash } from "lucide-react";

export default function CardBlog({
  title,
  description,
  image,
  href,
}: Readonly<{
  title: string;
  description: string;
  image?: string;
  href: string;
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
          <CardTitle className="mt-1 text-xl font-bold">{title}</CardTitle>
          <div
            className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert pt-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </CardHeader>
      <CardFooter className="px-2">
        <Link href={href}>
          <Button size={"sm"} className="gap-2">
            Read more <ArrowBigRightDash className="text-muted size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}