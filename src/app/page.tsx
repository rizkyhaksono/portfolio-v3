"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { supabaseUser } from "@/lib/supabase/server";
import CardProject from "@/components/layout/user/card-project";

export default function Home() {
  const [projects, setProjects] = useState<any>([]);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabaseUser.from("projects").select("*");
      if (error) {
        console.log(error);
      };
      setProjects(data);
    };
    fetchProject();
  }, []);

  const workExperiences = [
    {
      company: "Company A",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      duration: "2021 Jan - 2021 Dec",
      image: "/no-image.jpg",
    },
    {
      company: "Company B",
      description: "Enim mollitia beatae aliquid! Porro iure soluta amet veniam.",
      duration: "2020 Jan - 2020 Dec",
      image: "/no-image.jpg",
    },
    {
      company: "Company C",
      description: "Molestiae dignissimos labore ut vel suscipit animi!",
      duration: "2019 Jan - 2019 Dec",
      image: "/no-image.jpg",
    },
  ];

  const education = [
    {
      image: "/no-image.jpg",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      school: "Infinite Learning Indonesia",
      duration: "2018 Jan - 2021 Dec",
    },
    {
      image: "/no-image.jpg",
      description: "Molestiae dignissimos labore ut vel suscipit animi!",
      school: "University of Muhammadiyah Malang",
      duration: "2015 Jan - 2018 Dec",
    },
  ]

  return (
    <>
      <div className="grid grid-cols-10 gap-5 items-center">
        <div className="col-span-6 md:col-span-7 text-left">
          <div className="font-bold text-3xl">{`Hi, I'm Rizky Haksono`}</div><br />
          <span>{`Full Stack Developer. I love building web and mobile applications. Very active on GitHub and always looking for new opportunities.`}</span>
        </div>
        <Image
          src={"/rizky.jpg"}
          alt="Profile"
          width={1000}
          height={1000}
          className="rounded-full object-cover size-28 col-span-4 md:col-span-3 justify-self-end"
        />
      </div>

      <div className="mt-10">
        <p className="text-left text-xl font-semibold">About</p>
        <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert mt-2">
          Experience in Software Development with skills in Web and Mobile Development. I am still an undergraduate and have experience related to web and mobile development as well as UI/UX design.
          <a href="/cv-rizky-v3.pdf" download>
            <Button className="flex gap-2 mt-4 rounded-sm" variant={"default"}>
              CV <Download className="size-4" />
            </Button>
          </a>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Skill</p>
        <div className="flex flex-row gap-2 mt-2">
          <Badge>Next.js</Badge>
          <Badge>Flutter</Badge>
          <Badge>Docker</Badge>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Work Experience</p>
        {workExperiences.map((experience, index) => (
          <div key={index} className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 grid grid-cols-8 gap-4">
            <Image
              src={experience.image}
              alt={`${experience.company} logo`}
              width={1000}
              height={1000}
              className="rounded-full object-cover size-16 justify-self-start col-span-1"
            />
            <div className="col-span-5">
              <p>{experience.company}</p>
              <p className="text-muted-foreground">{experience.description}</p>
            </div>
            <div className="col-span-2 text-end">
              {experience.duration}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Education</p>
        {education.map((edu, index) => (
          <div key={index} className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 grid grid-cols-8 gap-4">
            <Image
              src={edu.image}
              alt={`${edu.school} logo`}
              width={1000}
              height={1000}
              className="rounded-full object-cover size-16 justify-self-start col-span-1"
            />
            <div className="col-span-5">
              <p>{edu.school}</p>
              <p className="text-muted-foreground">{edu.description}</p>
            </div>
            <div className="col-span-2 text-end">
              {edu.duration}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="text-center">
          <Button className="text-xl font-semibold" variant={"default"}>
            Project
          </Button>
          <div className="mt-2">
            Explore some of my recent projects
          </div>
          <span>{`I have experience working on a wide range of projects, from basic websites to advanced web applications. Here are a few that stand out.`}</span>
        </div>
        <div className="grid max-[760px]:grid-cols-1 grid-cols-2 gap-2 mt-4">
          {projects.map((project: any) => (
            <CardProject
              key={project.id}
              title={project.title}
              description={project.description}
              href={project.url}
              image={project.image || "/no-image.jpg"}
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="text-center">
          <Button className="text-xl font-semibold" variant={"default"}>
            Contact
          </Button>
          <div className="mt-2">
            Get in Touch
          </div>
        </div>
      </div>
    </>
  );
}
