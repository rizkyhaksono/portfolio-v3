"use client"

import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

export default function AboutSection() {


  return (
    <div className="bg-muted/40 dark:bg-muted/20 px-10 py-6 rounded-md" id="about-section">
      <p className="text-center text-2xl font-semibold mb-5">About me</p>
      <div className="grid grid-cols-1 md:grid-cols-10 max-[768px]:space-y-5 md:space-x-5">
        <div className="col-span-1 md:col-span-3">
          <Image
            src={"/rizky.jpg"}
            alt="Profile"
            width={500}
            height={500}
            className="h-96 md:h-full w-full rounded-md lg:rounded-e-sm object-cover lg:h-full"
          />
        </div>
        <div className="col-span-1 md:col-span-7 rounded-md">
          Experience in Software Development with skills in Web and Mobile Development.
          <br />
          I am still an undergraduate and have experience related to web and mobile development as well as UI/UX design.
          <a href="/cv-rizky-v3.pdf" download>
            <Button className="flex gap-2 mt-4">
              CV <Download className="size-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
