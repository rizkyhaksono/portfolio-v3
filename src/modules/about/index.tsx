import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AboutSection() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">About</p>
        <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
          Experience in Software Development with skills in Web and Mobile Development. I am still an undergraduate and have experience related to web and mobile development as well as UI/UX design.
          <div className="w-fit">
            <a href="/cv-rizky-v3.pdf" download>
              <Button className="flex gap-2 mt-4 rounded-sm" variant={"default"} size={"sm"}>
                CV <Download className="size-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </BlurFade>
  )
}