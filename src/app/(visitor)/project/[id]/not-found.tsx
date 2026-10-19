import { NotFoundView } from "@/components/ui/not-found-view"

export default function ProjectNotFound() {
  return (
    <NotFoundView title="Project not found">
      <p>There is no project at this address. It may have been taken down, or the link has a typo.</p>
    </NotFoundView>
  )
}
