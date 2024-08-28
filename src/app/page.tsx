"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { supabaseUser } from "@/lib/supabase/server";
import CardProject from "@/components/layout/user/card-project";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link";

export default function Home() {
  const [projects, setProjects] = useState<any>([]);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabaseUser.from("projects").select("*").order("created_at", { ascending: false });
      if (error) {
        console.log(error);
      };
      setProjects(data);
    };
    fetchProject();
  }, []);

  const workExperiences = [
    {
      company: "INFORMATICS LABORATORY UMM - PART TIME",
      description: "Information Systems",
      duration: "Aug 2022 - Present",
      image: "https://infotech.umm.ac.id/infotech-assets/favicon/favico.png",
    },
    {
      company: "PT. BEJANA INVESTIDATA GLOBALINDO - INTERNSHIP",
      description: "Full Stack Developer",
      duration: "Jan 2024 - Jun 2024",
      image: "https://www.bigio.id/themes/big-theme/assets/img/Beranda/favicon-150x150.png",
    },
  ];

  const education = [
    {
      image: "https://media.licdn.com/dms/image/v2/C560BAQEX1pFURxwK_g/company-logo_200_200/company-logo_200_200/0/1640263809942?e=2147483647&v=beta&t=wblJ0auqtcPbhZfF7NbSFVOFmmxZ9F3BO8NUCLp39xE",
      description: "Web Developer",
      school: "Infinite Learning Indonesia - Independent Study",
      duration: "Aug 2023 - Dec 2023",
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuIlbqOZjWEyUok7AT1rMa5-Wy9Mp6ahuxJQ&s",
      description: "Bachelor of Computer Science (GPA 3.90/4.00)",
      school: "University of Muhammadiyah Malang",
      duration: "2015 Jan - 2018 Dec",
    },
  ]

  return (
    <>
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
        <p className="text-left text-xl font-semibold">Skills</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge>Next.js</Badge>
          <Badge>Flutter</Badge>
          <Badge>Docker</Badge>
          <Badge>Git</Badge>
          <Badge>Portainer</Badge>
          <Badge>Express.js</Badge>
          <Badge>Nest.js</Badge>
          <Badge>PostgreSQL</Badge>
          <Badge>MySQL</Badge>
          <Badge>Laravel</Badge>
          <Badge>Java Spring</Badge>
          <Badge>Go</Badge>
          <Badge>ASP .NET</Badge>
        </div>
      </div>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Work Experience</p>
        {workExperiences.map((experience, index) => (
          <div
            key={experience.company + index}
            className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4"
          >
            <Image
              src={experience.image}
              alt={`${experience.company} logo`}
              width={1000}
              height={1000}
              className="rounded-full object-cover size-16 justify-self-start col-span-1"
            />
            <div className="flex-1">
              <p>{experience.company}</p>
              <p className="text-muted-foreground text-xs">{experience.description}</p>
            </div>
            <div className="text-end text-xs ml-auto self-start">
              {experience.duration}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Education</p>
        {education.map((edu, index) => (
          <div
            key={edu.school + index}
            className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4"
          >
            <Image
              src={edu.image}
              alt={`${edu.school} logo`}
              width={1000}
              height={1000}
              className="rounded-full object-cover size-16 justify-self-start"
            />
            <div className="flex-1">
              <p>{edu.school}</p>
              <p className="text-muted-foreground text-xs">{edu.description}</p>
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
            Projects
          </Button>
          <div className="mt-2 text-sm text-muted-foreground">
            {`I have experience working on a wide range of projects, from basic websites to advanced web applications. Here are a few that stand out.`}
          </div>
        </div>
        <div className="grid max-[760px]:grid-cols-1 grid-cols-2 gap-2 mt-4">
          {projects.map((project: any) => (
            <CardProject
              key={project.id}
              title={project.title}
              description={project.description}
              href={project.url}
              source={project.source_code}
              image={project.image || "/no-image.jpg"}
            />
          ))}
        </div>
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
            {`I am always open to new opportunities and collaborations. If you have any questions or would like to work together, please feel free to contact me.`}
          </div>
          <div className="flex flex-col gap-2 mt-5 items-center">
            <Input placeholder="Email" type="email" className="w-80" />
            <Textarea placeholder="Message" className="w-80" />
            <Button className="text-sm font-semibold mt-2 w-80" variant={"default"} size={"sm"} type="button">
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
