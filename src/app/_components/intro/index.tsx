import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { HyperText } from "@/components/magicui/hyper-text";
import { Button } from "@/components/ui/button";

export default function IntroSection() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="flex flex-col-reverse md:flex-row items-center gap-8">
        <div className="flex-1 text-left">
          <HyperText className="font-bold text-3xl mb-2">{`Hi, I'm Muhammad Rizky Haksono`}</HyperText>
          <span className="underline underline-offset-4">{`I'm a Software Engineer.`}</span>
          <span>
            {` I have a passion for `}
          </span>
          <span className="underline underline-offset-4">
            {`web, mobile, cloud, devops development`}
          </span>
          <span>
            {`, and love to create new things. Currently, I specialize in building high-performance web applications using modern technologies like React, Next.js, and TypeScript. I'm also experienced in cloud infrastructure and learning CI/CD pipelines.`}
          </span>
          <div className="mt-6">
            <Link href="/changelog">
              <Button variant="outline" size="sm">
                View Changelog
              </Button>
            </Link>
          </div>
        </div>

        {/* Original Profile Image for Mobile */}
        <Image
          src={"/rizky.jpg"}
          alt="Profile"
          width={1000}
          height={1000}
          className="mt-2 rounded-full object-cover size-28 md:hidden"
        />
      </div>
    </BlurFade >
  );
}
