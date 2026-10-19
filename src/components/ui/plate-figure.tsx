interface PlateFigureProps {
  /** The image (next/image or img). Sized by the caller so the frame reserves its space. */
  children: React.ReactNode
  caption?: React.ReactNode
  className?: string
}

/** A photo printed as a plate: double-rule frame (1px ink, 3px paper, 1px rule), duotone, caption. */
export function PlateFigure({ children, caption, className }: Readonly<PlateFigureProps>) {
  return (
    <figure className={className}>
      <div className="border border-ink p-[3px]">
        <div className="plate overflow-hidden border border-rule [&_img]:block">{children}</div>
      </div>
      {caption && <figcaption className="mt-2 font-display text-caption text-ink-soft">{caption}</figcaption>}
    </figure>
  )
}

export default PlateFigure
