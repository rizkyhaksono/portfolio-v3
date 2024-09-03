import Image from "next/image";
import BlurFade from "@/components/magicui/blur-fade";

export default function IntroSection() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="flex flex-row items-center gap-5">
        <div className="flex-1 text-left">
          <div className="font-bold text-3xl mb-2">{`Hi, I'm Rizky Haksono`}</div>
          <span className="text-base">
            {`Full Stack Developer. I love building web and mobile applications. Very active on GitHub and always looking for new opportunities.`}
          </span>
        </div>
        <Image
          src={"/rizky.jpg"}
          alt="Profile"
          width={1000}
          height={1000}
          className="rounded-full object-cover size-28 md:justify-self-end"
        />
      </div>
    </BlurFade>
  );
}
