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

export default function CardBlogMedium({
  title,
  description,
  href
}: Readonly<{
  title: string;
  description: string;
  href: string;
}>) {
  const extractImageFromDescription = (html: string): { imageUrl: string | null, cleanDescription: string } => {
    const imgRegex = /<figure><img.*?src="(.*?)".*?><\/figure>/;
    const match = imgRegex.exec(html);
    let imageUrl = null;
    let cleanDescription = html;
    if (match?.[1]) {
      imageUrl = match[1];
      cleanDescription = html.replace(/<figure><img.*?><\/figure>/, '');
    }
    const textOnly = cleanDescription.replace(/<\/?[^>]+(>|$)/g, " ").trim();
    return { imageUrl, cleanDescription: textOnly };
  };

  const { imageUrl, cleanDescription } = extractImageFromDescription(description);
  const descriptionPreview = cleanDescription.slice(0, 100) + (cleanDescription.length > 200 ? '...' : '');

  return (
    <Card className="flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          width={500}
          height={300}
          className="h-40 w-full overflow-hidden object-cover object-top"
          draggable={false}
          loading="lazy"
        />
      )}
      <CardHeader className="px-2">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-xl font-bold">{title}</CardTitle>
          <div className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert pt-2">
            {descriptionPreview}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="px-2">
        <Link href={href} target="_blank">
          <Button size={"sm"} className="gap-2">
            Read more <ArrowBigRightDash className="text-muted size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};