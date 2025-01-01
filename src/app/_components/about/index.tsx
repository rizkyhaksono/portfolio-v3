import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import Typography from "@/components/ui/typography";

export default function AboutSection() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <Typography.H4>About</Typography.H4>
        <div className="font-sans text-sm text-muted-foreground dark:prose-invert">
          Experience in Software Development with skills in Web and Mobile Development. I am still an undergraduate and have experience related to web and mobile development as well as UI/UX design.
          <div className="flex gap-4 w-full mt-4">
            <Link href="https://drive.google.com/file/d/1OXy50uSiyhbMBRzVyBstMW7-kAwQ37VZ/view?usp=sharing" target="_blank">
              <Button variant={"outline"} size={"sm"}>
                View CV <ExternalLink size={16} />
              </Button>
            </Link>
            <Link href="https://drive.google.com/file/d/1xb9nKFHr05NksJC5AAB0gl1fNco2apyP/view?usp=sharing" target="_blank">
              <Button variant={"outline"} size={"sm"}>
                View Portfolio in PDF <FileText size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </BlurFade>
  )
}