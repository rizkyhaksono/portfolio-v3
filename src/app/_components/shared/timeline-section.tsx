import Image from "next/image";
import BlurFade from "@/components/magicui/blur-fade";
import Typography from "@/components/ui/typography";

type TimelineItem = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  image: string | null;
};

type TimelineSectionProps = {
  title: string;
  items: TimelineItem[];
  delay?: number;
};

export default function TimelineSection({ title, items, delay = 0.25 }: TimelineSectionProps) {
  return (
    <BlurFade delay={delay} inView>
      <div className="mt-10">
        <Typography.H4>{title}</Typography.H4>
        {items?.map((item) => (
          <div
            key={item.id}
            className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4"
          >
            <Image
              src={item.image || "/placeholder.png"}
              alt={`${item.title} logo`}
              width={1000}
              height={1000}
              className="rounded-full object-cover size-16 justify-self-start"
            />
            <div className="flex-1">
              <Typography.P>{item.title}</Typography.P>
              <Typography.P className="text-muted-foreground text-xs">
                {item.subtitle}
              </Typography.P>
            </div>
            <div className="text-end text-xs ml-auto self-start">
              {item.duration}
            </div>
          </div>
        ))}
      </div>
    </BlurFade>
  );
}
