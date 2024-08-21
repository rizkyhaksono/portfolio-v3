"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseUser } from "@/lib/supabase/server";
import parse from 'html-react-parser';

export default function ProjectSection() {
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

  return (
    <div className="bg-muted/40 dark:bg-muted/20 px-10 py-6 rounded-md mt-10">
      <p className="text-center text-2xl font-semibold mb-5">Projects</p>
      <div className="flex space-x-4 p-4">
        {projects.map((project: any) => (
          <div key={project.id} className="flex flex-col w-96 bg-muted/80 rounded-md p-4">
            <p className="text-lg font-semibold underline underline-offset-8">
              <Link href={project.url} target="_blank">
                {project.title}
              </Link>
            </p>
            <p className="text-sm mt-2">{parse(project.description)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
