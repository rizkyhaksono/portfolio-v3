import { render, screen } from "@testing-library/react"
import { Clock } from "lucide-react"
import { ArticleLoading, GallerySkeleton, PageLoading } from "./page-loading"

it("keeps the real title, says loading once and hides the grey shapes", () => {
  const { container } = render(
    <PageLoading label="Loading the projects…" title="Projects" description>
      <GallerySkeleton cards={2} />
    </PageLoading>,
  )
  expect(screen.getByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument()
  expect(screen.getAllByRole("status")).toHaveLength(1)
  expect(screen.getByRole("status")).toHaveTextContent("Loading the projects…")
  expect(container.firstElementChild).toHaveAttribute("aria-busy", "true")
  // The cards sit inside the hidden block, so a screen reader hears only the status line.
  expect(screen.queryAllByRole("listitem")).toHaveLength(0)
})

it("shows an article's property names with grey values", () => {
  render(<ArticleLoading label="Loading the lesson…" properties={[{ label: "Reading time", icon: <Clock /> }]} />)
  expect(screen.getByRole("status")).toHaveTextContent("Loading the lesson…")
  expect(screen.getByText("Reading time", { selector: "dt" })).toBeInTheDocument()
})
