import OrbitingCircles from "@/components/magicui/orbiting-circles";
import TextReveal from "@/components/magicui/text-reveal";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export default function SkillsSection() {
  return (
    <>
      <div className="z-10 flex min-h-[16rem] items-center justify-center">
        <TextReveal text="That's a quick introduction, now let's dive into the tech I've been using... 🚀" />
      </div>
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Inner Circles */}
        <OrbitingCircles
          className="h-[30px] w-[30px] border-none bg-transparent"
          duration={20}
          delay={20}
          radius={80}
        >
          <Image src="/icons/docker-icon.svg" width={50} height={50} alt="Icon" />
        </OrbitingCircles>
        <OrbitingCircles
          className="h-[30px] w-[30px] border-none bg-transparent"
          duration={20}
          delay={10}
          radius={80}
        >
          <Image src="/icons/flutter-icon.svg" width={50} height={50} alt="Icon" />
        </OrbitingCircles>

        {/* Outer Circles (reverse) */}
        <OrbitingCircles
          className="h-[50px] w-[50px] border-none bg-transparent"
          radius={190}
          duration={20}
          reverse
        >
          <Image src="/icons/typescript-icon.svg" width={50} height={50} alt="Icon" />
        </OrbitingCircles>
        <OrbitingCircles
          className="h-[50px] w-[50px] border-none bg-transparent"
          radius={190}
          duration={20}
          delay={20}
          reverse
        >
          <GitHubLogoIcon className="w-20 h-20" />
        </OrbitingCircles>
        <OrbitingCircles
          className="h-[50px] w-[50px] border-none bg-transparent"
          radius={190}
          duration={20}
          delay={20}
          reverse
        >
          <Image src="/icons/next-js-icon.svg" width={50} height={50} alt="Icon" />
        </OrbitingCircles>
      </div>
    </>
  );
}