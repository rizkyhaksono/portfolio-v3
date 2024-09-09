import { Badge } from "@/components/ui/badge"
import Marquee from "@/components/magicui/marquee";
import BlurFade from "@/components/magicui/blur-fade";
import {
  skills_data_top,
  skills_data_bottom,
} from "@/commons/constants/skills";

export default function SkillSection() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Skills</p>
        <div className="relative w-full flex-col">
          <Marquee className="[--duration:15s]">
            {skills_data_top.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </Marquee>
          <Marquee reverse className="[--duration:25s]">
            {skills_data_bottom.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
      </div>
    </BlurFade>
  )
}