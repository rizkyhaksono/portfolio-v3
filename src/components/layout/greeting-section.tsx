import Image from "next/image"
import Link from "next/link"
import { InstagramLogoIcon, GitHubLogoIcon, TwitterLogoIcon, ArrowDownIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

export default function GreetingSection() {
  return (
    <div className="h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
        <div className="col-span-1 flex flex-row lg:flex-col items-start justify-center gap-3">
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
        <div className="bg-muted/40 dark:bg-muted/20 lg:col-span-5 p-5 rounded-md">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque sunt quis cumque esse. Impedit in et earum culpa, necessitatibus aliquam voluptatem, laboriosam possimus, magnam quis vel temporibus animi deserunt numquam.
        </div>
        <div className="lg:col-span-2">
          <Image src={"/rizky.jpg"} alt="Profile" width={500} height={500} className="w-40 h-40 lg:w-fit rounded-none lg:rounded-e-sm object-cover lg:h-full" />
        </div>
      </div>
      <div className="flex flex-col w-fit mt-10 items-center">
        <Button variant={"default"}>
          Scroll Down <ArrowDownIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
