import { render, screen, within } from "@testing-library/react"
import "@testing-library/jest-dom"

import { ToolCabinet } from "./tool-shell"

// The panels are code-split; the gallery is what is under test.
jest.mock("next/dynamic", () => () => () => null)

describe("ToolCabinet", () => {
  it("lists every tool as a ?tab= link with the tool-open track, grouped", () => {
    render(<ToolCabinet tab="wpm" />)

    const nav = screen.getByRole("navigation", { name: "Tools" })
    const links = within(nav).getAllByRole("link")
    expect(links).toHaveLength(9)
    for (const link of links) {
      expect(link.getAttribute("href")).toMatch(/^\/tools\?tab=[a-z0-9-]+$/)
      expect(link).toHaveAttribute("data-track", "tool-open")
      expect(link).not.toHaveAttribute("data-umami-event")
    }
    expect(within(nav).getAllByRole("heading").map((h) => h.textContent)).toEqual(["Play", "Practise", "Look things up"])
  })

  it("marks only the open tool's card and names the open tool in the h2", () => {
    render(<ToolCabinet tab="wpm" />)

    const current = screen.getByRole("link", { current: "page" })
    expect(current).toHaveAttribute("href", "/tools?tab=wpm")
    expect(current).toHaveAttribute("data-track-tool", "wpm")
    expect(screen.getAllByRole("link").filter((l) => l.hasAttribute("aria-current"))).toHaveLength(1)
    expect(screen.getByRole("heading", { level: 2, name: "Typing test" })).toHaveAttribute("id", "tool-title")
  })

  it("marks no card before the URL is read", () => {
    render(<ToolCabinet tab={null} />)
    expect(screen.queryByRole("link", { current: "page" })).not.toBeInTheDocument()
  })
})
