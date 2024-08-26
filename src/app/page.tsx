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

  console.log(projects)

  return (
    <>
      <div className="grid grid-cols-10 gap-5 items-center">
        <div className="col-span-6 md:col-span-7 text-left">
          <span className="font-bold text-3xl">{`Hi, I'm Rizky Haksono`}</span><br />
          <span>{`Full Stack Developer. I love building web and mobile applications. Very active on GitHub and always looking for new opportunities.`}</span>
        </div>
        <Image
          src={"/rizky.jpg"}
          alt="Profile"
          width={500}
          height={500}
          className="rounded-full object-cover size-28 col-span-4 md:col-span-3 justify-self-end"
        />
      </div>

      <div className="mt-10">
        <p className="text-left text-xl font-semibold">About</p>
        <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert mt-2">
          <div className="text-sm">
            Experience in Software Development with skills in Web and Mobile Development. I am still an undergraduate and have experience related to web and mobile development as well as UI/UX design.
            <a href="/cv-rizky-v3.pdf" download>
              <Button className="flex gap-2 mt-4 rounded-sm" variant={"default"}>
                CV <Download className="size-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p>Skills</p>
        <div className="flex flex-row gap-2 mt-2">
          <Badge>Next.js</Badge>
          <Badge>Flutter</Badge>
          <Badge>Docker</Badge>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Work Experience</p>
        <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert mt-2">
          <div className="text-sm">

          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Education</p>
        <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert mt-2">
          <div className="text-sm">

          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="text-center">
          <Button className="text-xl font-semibold" variant={"default"}>
            Project
          </Button>
          <div className="mt-2">
            Check out my latest work
          </div>
          <span>{`I've worked on a variety of projects, from simple websites to complex web applications. Here are a few of my favorites.`}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
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
    </>
  );
}
