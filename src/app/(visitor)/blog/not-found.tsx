import { InkLink } from "@/components/ui/ink-link"
import { NotFoundTrack } from "@/components/ui/not-found-track"
import NotFoundView from "@/components/ui/not-found-view"

/** One not-found for DEV and onsite articles alike. */
export default function BlogNotFound() {
  return (
    <>
      <NotFoundView title="There is no article at this address.">
        <p>
          It may have moved, or the link has a typo. <InkLink href="/blog">The writing page</InkLink> lists every article.
        </p>
      </NotFoundView>
      <NotFoundTrack />
    </>
  )
}
