import BaseLayout from "@/components/layout/base-layout"
import NotFoundView from "@/components/ui/not-found-view"
import { NotFoundTrack } from "@/components/ui/not-found-track"

export default function NotFound() {
  return (
    <BaseLayout>
      <NotFoundView />
      <NotFoundTrack />
    </BaseLayout>
  )
}
