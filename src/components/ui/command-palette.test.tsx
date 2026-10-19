import { act, fireEvent, render, screen } from "@testing-library/react"
import { CommandPalette } from "./command-palette"

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock("next-themes", () => ({ useTheme: () => ({ setTheme: jest.fn() }) }))

const docs = [
  { id: "p1", type: "project", title: "React dashboard", description: "Charts for sales", url: "/project/p1", tags: ["react", "charts"] },
  { id: "b1", type: "blog", title: "Kanban notes", description: "Working in a team", url: "/blog/kanban", tags: [] },
]

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Element.prototype.scrollIntoView = jest.fn()
  global.fetch = jest.fn(async () => ({ json: async () => ({ docs }) })) as unknown as typeof fetch
})

it("finds a document by a tag without crashing (stored tags stay an array)", async () => {
  await act(async () => {
    render(<CommandPalette open onOpenChange={() => {}} />)
  })

  fireEvent.change(screen.getByPlaceholderText(/search pages/i), { target: { value: "charts" } })

  expect(await screen.findByText("React dashboard")).toBeInTheDocument()
  expect(screen.queryByText("Kanban notes")).not.toBeInTheDocument()
})
