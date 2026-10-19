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

  it("falls back to the chat tab for an unknown ?tab=", () => {
    render(<AIHub chat={<p>Chat panel</p>} initialTab="nope" />)
    expect(screen.getByRole("tab", { name: "Chat" })).toHaveAttribute("aria-selected", "true")
    expect(screen.getByText("Chat panel")).toBeInTheDocument()
    expect(screen.queryByText("Tool panel")).not.toBeInTheDocument()
  })

  it("loads a tool on first visit, keeps the chat mounted, and syncs ?tab=", async () => {
    render(<AIHub chat={<p>Chat panel</p>} />)
    await userEvent.click(screen.getByRole("tab", { name: "Hire fit" }))

    // jsdom has no Tailwind: the inactive panel is hidden by `data-[state=inactive]:hidden`, so assert the state.
    expect(screen.getByText("Tool panel").closest("[role=tabpanel]")).toHaveAttribute("data-state", "active")
    expect(screen.getByText("Chat panel").closest("[role=tabpanel]")).toHaveAttribute("data-state", "inactive")
    expect(window.location.search).toBe("?tab=hirefit")
    expect(track).toHaveBeenCalledWith("ai-tab", { tab: "hirefit" })

    await userEvent.click(screen.getByRole("tab", { name: "Chat" }))
    expect(window.location.search).toBe("")
  })
})
