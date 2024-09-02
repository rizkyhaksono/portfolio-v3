import Image from "next/image";
import BlurFade from "@/components/magicui/blur-fade";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { getReadStats, getALLTimeSinceToday } from "@/lib/services/wakatime";
import { GITHUB_ACCOUNTS } from "@/lib/commons/constants/github";
import GithubCalendar from "@/components/layout/user/github-calender";
import GithubOverview from "@/components/layout/user/github-overview";
import WakatimeActive from "@/components/layout/user/wakatime-active";
import WakatimeOverview from "@/components/layout/user/wakatime-overview";
import { fetchGithubData } from "@/lib/services/github";
import SkillSection from "@/lib/modules/skills";
import ContactSection from "@/lib/modules/contact";
import EducationSection from "@/lib/modules/education";
import CarrerSection from "@/lib/modules/career";

export default async function Home() {
  const readStatsResponse = await getReadStats();
  const allTimeSinceTodayResponse = await getALLTimeSinceToday();

  const wakatime = {
    ...readStatsResponse.data,
    all_time_since_today: allTimeSinceTodayResponse.data,
  };

  const github = await fetchGithubData(
    GITHUB_ACCOUNTS[0].username,
    GITHUB_ACCOUNTS[0].token
  );

  return (
    <div className="container max-w-4xl min-h-screen pt-12 sm:pt-24 px-6">
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
      <BlurFade delay={0.25} inView>
        <div className="mt-10">
          <p className="text-left text-xl font-semibold">Skills</p>
          <SkillSection />
        </div>
      </BlurFade>
      <BlurFade delay={0.25} inView>
        <div className="mt-10">
          <p className="text-left text-xl font-semibold">Work Experience</p>
          <CarrerSection />
        </div>
      </BlurFade>
      <BlurFade delay={0.25} inView>
        <div className="mt-10">
          <p className="text-left text-xl font-semibold">Education</p>
          <EducationSection />
        </div>
      </BlurFade>
      <BlurFade delay={0.25} inView>
        <div className="mt-10">
          <p className="text-left text-xl font-semibold">GitHub Contributions</p>
          <WakatimeOverview data={wakatime} />
          <WakatimeActive data={wakatime} />
          <GithubOverview
            data={github?.data?.contributionsCollection?.contributionCalendar}
          />
          <GithubCalendar
            data={github?.data?.contributionsCollection?.contributionCalendar}
          />
        </div>
      </BlurFade>
      <BlurFade delay={0.25} inView>
        <div className="mt-10">
          <p className="text-left text-xl font-semibold">Contact</p>
          <p className="flex justify-start text-muted-foreground text-sm">
            {`Feel free to get in touch and let's have a discussion about how we can work together.`}
          </p>
          <Separator className="my-5" />
          <p className="text-left text-base font-semibold">
            Find me on social media
          </p>
          <div className="mt-5 flex flex-row gap-2">
            <Button className="w-full rounded-sm" variant={"outline"}>
              Github
            </Button>
            <Button className="w-full rounded-sm" variant={"outline"}>
              Instagram
            </Button>
            <Button className="w-full rounded-sm" variant={"outline"}>
              LinkedIn
            </Button>
            <Button className="w-full rounded-sm" variant={"outline"}>
              Email
            </Button>
          </div>
          <Separator className="my-5" />
          <p className="text-left text-base font-semibold">
            Or send me a message
          </p>
          <ContactSection />
        </div>
      </BlurFade>
    </div>
  );
}
