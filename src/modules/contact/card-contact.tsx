import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Icon } from "next/dist/lib/metadata/types/metadata-types";

type CardContactProps = {
  title: string;
  href: string;
  icon?: Icon;
};

export default function CardContact({
  title,
  icon,
  href,
}: Readonly<CardContactProps>) {
  return (
    <Link href={href} target="_blank" className="w-full">
      <Button className="w-full rounded-sm" variant={"outline"}>
        {title}
      </Button>
    </Link>
  )
}