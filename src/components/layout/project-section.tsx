"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { supabaseUser } from "@/lib/supabase/server";

export default function ProjectSection() {
  const [projects, setProjects] = useState<any>([]);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await  supabaseUser.from("projects").select("*");
      if (error) {
        console.log(error);
      };
      setProjects(data);
    };
    fetchProject();
  }, []);

  return (
    <div className="bg-muted/40 dark:bg-muted/20 px-10 py-6 rounded-md mt-10">
      <p className="text-center text-2xl font-semibold mb-5">Project</p>
      <div className="">
        <div>
          {
            "I have experience with a wide range of technologies, including Frontend, Backend, and Devops. I am always looking for new projects to work on, so if you have a project in mind, feel free to get in touch!"
          }
        </div>

        <ScrollArea className="w-full rounded-md border mt-5">
          <div className="flex space-x-4 p-4 overflow-x-auto">
            {projects.map((project: any) => (
              <div key={project.id} className="flex flex-col w-64 h-40 bg-muted/80 rounded-md p-4">
                <p className="text-lg font-semibold underline underline-offset-8">{project.title}</p>
                <p className="text-sm mt-2">{project.description}</p>
                <p className="text-sm mt-2">{project.url}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
