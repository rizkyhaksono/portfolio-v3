import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"

import AIHub from "./ai-hub"
import { track } from "@/lib/analytics"

jest.mock("next/dynamic", () => () => function Tool() {
  return <p>Tool panel</p>
})
jest.mock("@/lib/analytics", () => ({ track: jest.fn() }))

describe("AIHub", () => {
  beforeEach(() => window.history.replaceState(null, "", "/ai"))

  it("hides the chat tab and opens on the document reader, also for ?tab=chat", () => {
    render(<AIHub initialTab="chat" />)
    expect(screen.queryByRole("tab", { name: "Chat" })).not.toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Document reader" })).toHaveAttribute("aria-selected", "true")
  })

  it("loads a tool on first visit, keeps the other mounted, and syncs ?tab=", async () => {
    render(<AIHub />)
    await userEvent.click(screen.getByRole("tab", { name: "Hire fit" }))

    // jsdom has no Tailwind: the inactive panel is hidden by `data-[state=inactive]:hidden`, so assert the state.
    const [reader, hireFit] = screen.getAllByText("Tool panel").map((el) => el.closest("[role=tabpanel]"))
    expect(hireFit).toHaveAttribute("data-state", "active")
    expect(reader).toHaveAttribute("data-state", "inactive")
    expect(window.location.search).toBe("?tab=hirefit")
    expect(track).toHaveBeenCalledWith("ai-tab", { tab: "hirefit" })

    await userEvent.click(screen.getByRole("tab", { name: "Document reader" }))
    expect(window.location.search).toBe("")
  })
})
