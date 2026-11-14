import { InkLink } from "@/components/ui/ink-link"
import { NotFoundTrack } from "@/components/ui/not-found-track"
import NotFoundView from "@/components/ui/not-found-view"

/** One not-found for DEV and onsite articles alike. */
export default function BlogNotFound() {
  return (
    <>
      <NotFoundView title="Article not found">
        <p>
          There is no article at this address. It may have moved, or the link has a typo;{" "}
          <InkLink href="/blog">the writing index</InkLink> lists everything.
        </p>
      </NotFoundView>
      <NotFoundTrack />
    </>
  )
}
