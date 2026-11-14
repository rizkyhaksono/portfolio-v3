import Image, { type StaticImageData } from "next/image"

/** Notion's page cover: a photo across the top of the page, 30% of the viewport tall, cropped to fit. */
export function PageCover({ src, position = "50% 45%" }: Readonly<{ src: StaticImageData; position?: string }>) {
  return (
    <div data-print-hide className="relative h-[30vh] max-h-80 min-h-44 overflow-hidden bg-muted">
      <Image src={src} alt="" fill priority placeholder="blur" sizes="(min-width: 1024px) calc(100vw - 15rem), 100vw" className="object-cover" style={{ objectPosition: position }} />
    </div>
  )
}
