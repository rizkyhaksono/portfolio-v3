import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import Marquee from "@/components/magicui/marquee";
import Link from "next/link";
import { GITHUB_ACCOUNTS } from "@/lib/constant/github";
import GithubCalendar from "@/components/layout/github-calender";
import GithubOverview from "@/components/layout/user/github-overview";
import { fetchGithubData } from "@/lib/services/github";
import UserContact from "@/components/layout/user/contact";
import { getAllCarrer } from "@/lib/services/career";
import { getAllEducation } from "@/lib/services/education";

export default async function Home() {
  const careers = await getAllCarrer();
  const educations = await getAllEducation();

  const github = await fetchGithubData(
    GITHUB_ACCOUNTS[0].username,
    GITHUB_ACCOUNTS[0].token
  );

  return (
    <div className="container max-w-2xl min-h-screen pt-12 sm:pt-24 px-6">
      <div className="flex flex-row items-center gap-5">
        <div className="flex-1 text-left">
          <div className="font-bold text-3xl mb-2">{`Hi, I'm Rizky Haksono`}</div>
          <span className="text-base">{`Full Stack Developer. I love building web and mobile applications. Very active on GitHub and always looking for new opportunities.`}</span>
        </div> 
        <Image
          src={"/rizky.jpg"}
          alt="Profile"
          width={1000}
          height={1000}
          className="rounded-full object-cover size-28 md:justify-self-end"
        />
      </div>
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
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">GitHub Contributions</p>
        <GithubOverview
          data={github?.data?.contributionsCollection?.contributionCalendar}
        />
        <GithubCalendar
          data={github?.data?.contributionsCollection?.contributionCalendar}
        />
      </div>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Skills</p>
        <div className="relative w-full flex-col">
          <Marquee pauseOnHover className="[--duration:30s]">
            <Badge>Typescript</Badge>
            <Badge>Javascript</Badge>
            <Badge>Next.js</Badge>
            <Badge>Flutter</Badge>
            <Badge>Docker</Badge>
            <Badge>Git</Badge>
            <Badge>Portainer</Badge>
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:30s]">
            <Badge>Express.js</Badge>
            <Badge>Nest.js</Badge>
            <Badge>Astro.js</Badge>
            <Badge>PostgreSQL</Badge>
            <Badge>MySQL</Badge>
            <Badge>Laravel</Badge>
            <Badge>Spring Boot</Badge>
            <Badge>Go</Badge>
            <Badge>ASP .NET</Badge>
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
      </div>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Work Experience</p>
        {careers?.map((career: any) => (
          <div
            key={career.title}
            className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4"
          >
            <Image
              src={career.image}
              alt={`${career.title} logo`}
              width={1000}
              height={1000}
              className="rounded-full object-cover size-16 justify-self-start"
            />
            <div className="flex-1">
              <p>{career.title}</p>
              <p className="text-muted-foreground text-xs">{career.subtitle}</p>
            </div>
            <div className="text-end text-xs ml-auto self-start">
              {career.duration}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Education</p>
        {educations?.map((edu: any) => (
          <div
            key={edu.title}
            className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4"
          >
            <Image
              src={edu.image}
              alt={`${edu.title} logo`}
              width={1000}
              height={1000}
              className="rounded-full object-cover size-16 justify-self-start"
            />
            <div className="flex-1">
              <p>{edu.title}</p>
              <p className="text-muted-foreground text-xs">{edu.subtitle}</p>
            </div>
            <div className="text-end text-xs ml-auto self-start">
              {edu.duration}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <div className="text-center">
          <Button className="text-base font-semibold" variant={"default"} size={"sm"}>
            Certificates
          </Button>
          <Link
            href={"https://www.linkedin.com/in/rizkyhaksono/details/certifications"}
            target="_blank"
          >
            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                {`I have completed various online courses and have received certificates for them.`}
              </p>
              <p className="underline underline-offset-4 flex justify-center">
                {`Click here to view all certificates on LinkedIn.`}
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <div className="text-center">
          <Button className="text-base font-semibold" variant={"default"} size={"sm"}>
            Contact
          </Button>
          <div className="mt-2 text-sm text-muted-foreground">
            If you have any questions or would like to work together, feel free to reach out.
          </div>
        </div>
        <UserContact />
      </div>
    </div>
  );
}
