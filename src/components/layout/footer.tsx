import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <div className="container max-w-4xl pt-5 pb-24 sm:pb-32">
      <Separator className="mt-5" />
      <div className="flex w-full flex-col items-center justify-between gap-5 my-5 sm:flex-row">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Copyright © {new Date().getFullYear()}{" "}
          <Link href="https://github.com/rizkyhaksono" className="underline underline-offset-2" target="_blank">
            Rizky Haksono
          </Link>
        </p>
      </div>
    </div>
  )
}
