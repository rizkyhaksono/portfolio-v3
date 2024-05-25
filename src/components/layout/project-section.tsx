"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function ProjectSection() {
  return (
    <div className="bg-muted/40 px-10 py-6 rounded-xl mt-10">
      <p className="text-center">Project</p>
      <div className="">
        <div>
          {
            "This is my portfolio. I have worked on a variety of projects, ranging from small websites to large web applications. I have experience with a wide range of technologies, including HTML, CSS, JavaScript, React, and Node.js. I am always looking for new projects to work on, so if you have a project in mind, feel free to get in touch!"
          }
        </div>

        <ScrollArea className="w-full rounded-md border mt-5">
          <div className="flex space-x-4 p-4 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div className="bg-muted/80 p-5 rounded-xl" key={item}>
                <p className="text-center">Project {item}</p>
                <p className="w-52">{"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et sapien nec ipsum tincidunt fermentum. Nullam et sapien nec ipsum tincidunt fermentum."}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
