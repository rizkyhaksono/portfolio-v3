import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowBigRightDash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CardBlogMediumProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

export default function CardBlogMedium({
  title,
  description,
  image,
  href
}: Readonly<
  CardBlogMediumProps
>) {
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
        <CardTitle className="mt-1 text-xl font-bold">{title}</CardTitle>
        <div
          className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert pt-2"
          dangerouslySetInnerHTML={{ __html: description.split("</p>")[0] + "</p>" }}
        />
      </CardHeader>
      <CardFooter className="px-2">
        <Link
          href={href}
          target="_blank"
        >
          <Button size={"sm"} className="gap-2">
            Read more <ArrowBigRightDash className="text-muted size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};