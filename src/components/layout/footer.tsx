import Link from "next/link"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <>
      <Separator className="mt-5" />
      <div className="flex w-full flex-col items-center justify-between gap-5 my-5 sm:flex-row">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Copyright © {new Date().getFullYear()}{" "}
          <Link href="https://github.com/rizkyhaksono" className="underline underline-offset-2" target="_blank">
            Rizky Haksono
          </Link>{" "}
        </p>
        <div className="flex gap-4">
          <Link href="https://github.com/rizkyhaksono" target="_blank">
            <GitHubLogoIcon />
          </Link>
        </div>
      </div>
    </>
  )
}
