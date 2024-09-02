import { Badge } from "@/components/ui/badge"
import Marquee from "@/components/magicui/marquee";
import {
  skills_data_top,
  skills_data_bottom
} from "@/lib/commons/constants/skills";

export default function SkillSection() {
  return (
    <div className="relative w-full flex-col">
      <Marquee pauseOnHover className="[--duration:30s]">
        {skills_data_top.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {skills_data_bottom.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  )
}