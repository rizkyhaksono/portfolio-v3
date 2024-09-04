import Link from "next/link"
import { Button } from "@/components/ui/button";
import { media_socials } from "@/commons/constants/contact";

export default function CardContact() {
  return (
    <>
      {media_socials.map((item, index) => (
        <Link key={index} href={item.href} className="w-full">
          <Button className="w-full rounded-sm text-xs" variant={"outline"}>
            <item.icon className="size-4 mr-2" /> {item.title}
          </Button>
        </Link>
      ))}
    </>
  )
}