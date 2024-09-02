import Image from "next/image"
import { getAllCarrer } from "@/services/career";

export default async function CarrerSection() {
  const careers = await getAllCarrer();

  return (
    <>
      {careers?.map((career: any) => (
        <div
          key={career.title}
          className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4"
        >
          <Image
            src={career.image}
            alt={`${career.title} logo`}
            width={1000}
            height={1000}
            className="rounded-full object-cover size-16 justify-self-start"
          />
          <div className="flex-1">
            <p>{career.title}</p>
            <p className="text-muted-foreground text-xs">{career.subtitle}</p>
          </div>
          <div className="text-end text-xs ml-auto self-start">
            {career.duration}
          </div>
        </div>
      ))}
    </>
  )
}