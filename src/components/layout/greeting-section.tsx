"use client";

import Image from "next/image";
import Link from "next/link";
import { InstagramLogoIcon, GitHubLogoIcon, TwitterLogoIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export default function GreetingSection() {
  return (
    <div className="lg:h-screen">
      <div className="flex flex-row">
        <div className="hidden lg:flex lg:flex-col mr-3 justify-center items-center gap-2">
          <Link href={"instagram.com/rizkyhaksonoo"} target="_blank">
            <InstagramLogoIcon className="h-6 w-6" />
          </Link>
          <Link href={"https://github.com/rizkyhaksono"} target="_blank">
            <GitHubLogoIcon className="h-6 w-6" />
          </Link>
          <Link href={"https://x.com/rizkyhaksono"} target="_blank">
            <TwitterLogoIcon className="h-6 w-6" />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-8">
          <div className="bg-muted/40 dark:bg-muted/20 lg:col-span-6 p-5 rounded-md lg:rounded-s-sm">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque sunt quis cumque esse. Impedit in et earum culpa, necessitatibus aliquam voluptatem, laboriosam possimus, magnam quis vel temporibus animi deserunt numquam.
          </div>
          <div className="grid-cols-1 lg:col-span-2 lg:mt-0 mt-5 flex justify-between">
            <div className="flex lg:hidden flex-col mr-3 justify-center items-center gap-2">
              <Link href={"instagram.com/rizkyhaksonoo"} target="_blank">
                <InstagramLogoIcon className="h-6 w-6" />
              </Link>
              <Link href={"https://github.com/rizkyhaksono"} target="_blank">
                <GitHubLogoIcon className="h-6 w-6" />
              </Link>
              <Link href={"https://x.com/rizkyhaksono"} target="_blank">
                <TwitterLogoIcon className="h-6 w-6" />
              </Link>
            </div>
            <Image src={"/rizky.jpg"} alt="Profile" width={500} height={500} className="w-full h-40 lg:w-full rounded-md lg:rounded-e-sm object-cover lg:h-full" />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-fit my-10 lg:mt-10 items-center">
        <Button
          variant={"default"}
          onClick={() => {
            document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Scroll Down <ArrowDownIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
