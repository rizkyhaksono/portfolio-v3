import BlurFade from "@/components/magicui/blur-fade";
import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import Typography from "@/components/ui/typography";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";

export default function AboutSection() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <Typography.H4>About</Typography.H4>
        <div className="font-sans text-sm text-muted-foreground dark:prose-invert">
          Experience in Software Development with skills in Web and Mobile Development. I am still an undergraduate and have experience related to web and mobile development as well as UI/UX design.
          <div className="flex gap-4 w-full mt-4">
            <Link href="https://drive.google.com/file/d/1cZnjFsdn5vduIwuaRxtYLVigoqeA0YiN/view?usp=sharing" target="_blank">
              <div
                className={cn(
                  "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                )}
              >
                <AnimatedShinyText className="inline-flex items-center justify-center h-8 rounded-md px-3 text-xs transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                  <span>✨ View CV</span>
                  <ExternalLink className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedShinyText>
              </div>
            </Link>
            <Link href="https://drive.google.com/file/d/1f-x1PWRBmoYzzPi8t8thA0s6RTymuTdx/view?usp=sharing" target="_blank">
              <AnimatedGradientText className="h-8 rounded-md px-3 text-xs">
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                  )}
                >
                  View Portfolio in PDF
                </span>
                <FileText size={16} className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedGradientText>
            </Link>
          </div>
        </div>
      </div>
    </BlurFade>
  )
}