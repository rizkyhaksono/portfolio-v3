import { act, fireEvent, render, screen } from "@testing-library/react"
import { CommandPalette } from "./command-palette"

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock("next-themes", () => ({ useTheme: () => ({ setTheme: jest.fn() }) }))

const docs = [
  { id: "p1", type: "project", title: "React dashboard", description: "Charts for sales", url: "/project/p1", tags: ["react", "charts"] },
  { id: "b1", type: "blog", title: "Kanban notes", description: "Working in a team", url: "/blog/kanban", tags: [] },
]

const fetchMock = jest.fn()

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Element.prototype.scrollIntoView = jest.fn()
  global.fetch = fetchMock as unknown as typeof fetch
})

beforeEach(() => {
  fetchMock.mockReset()
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ docs }) })
})

it("finds a document by a tag without crashing (stored tags stay an array)", async () => {
  await act(async () => {
    render(<CommandPalette open onOpenChange={() => {}} />)
  })

  fireEvent.change(screen.getByPlaceholderText(/search pages/i), { target: { value: "charts" } })

  expect(await screen.findByText("React dashboard")).toBeInTheDocument()
  expect(screen.queryByText("Kanban notes")).not.toBeInTheDocument()
})

it("says the index failed, then fetches it again the next time search opens", async () => {
  fetchMock.mockResolvedValueOnce({ ok: false, json: async () => ({}) })
  let view!: ReturnType<typeof render>
  await act(async () => {
    view = render(<CommandPalette open onOpenChange={() => {}} />)
  })
  fireEvent.change(screen.getByPlaceholderText(/search pages/i), { target: { value: "charts" } })
  expect(await screen.findByText(/search did not load/i)).toBeInTheDocument()

  await act(async () => {
    view.rerender(<CommandPalette open={false} onOpenChange={() => {}} />)
  })
  await act(async () => {
    view.rerender(<CommandPalette open onOpenChange={() => {}} />)
  })
  fireEvent.change(screen.getByPlaceholderText(/search pages/i), { target: { value: "charts" } })

  expect(await screen.findByText("React dashboard")).toBeInTheDocument()
  expect(fetchMock).toHaveBeenCalledTimes(2)
})
