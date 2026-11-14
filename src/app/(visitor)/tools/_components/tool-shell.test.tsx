import { render, screen, within } from "@testing-library/react"
import "@testing-library/jest-dom"

import { ToolCabinet, ToolShell } from "./tool-shell"

// The panels are code-split; the list and the open tool's header are what is under test.
jest.mock("next/dynamic", () => () => () => null)

let search = new URLSearchParams()
jest.mock("next/navigation", () => ({ useSearchParams: () => search }))

describe("ToolCabinet", () => {
  it("lists every tool once as a ?tab= link with the tool-open track, under its group label", () => {
    render(<ToolCabinet tab="wpm" />)

    const nav = screen.getByRole("navigation", { name: "Tools" })
    const links = within(nav).getAllByRole("link")
    expect(links).toHaveLength(9)
    expect(new Set(links.map((l) => l.getAttribute("href"))).size).toBe(9)
    for (const link of links) {
      expect(link.getAttribute("href")).toMatch(/^\/tools\?tab=[a-z0-9-]+$/)
      expect(link).toHaveAttribute("data-track", "tool-open")
      expect(link).not.toHaveAttribute("data-umami-event")
    }
    expect(within(nav).getAllByRole("heading").map((h) => h.textContent)).toEqual(["Play", "Practise", "Look things up"])
    expect(within(screen.getByRole("region", { name: "Practise" })).getAllByRole("link").map((l) => l.textContent)).toEqual([
      "Typing test",
      "Japanese quiz",
      "IELTS flashcards",
    ])
  })

  it("marks only the open tool and names it, with its one line, in the header beside the list", () => {
    render(<ToolCabinet tab="wpm" />)

    const current = screen.getByRole("link", { current: "page" })
    expect(current).toHaveAttribute("href", "/tools?tab=wpm")
    expect(current).toHaveAttribute("data-track-tool", "wpm")
    expect(screen.getAllByRole("link").filter((l) => l.hasAttribute("aria-current"))).toHaveLength(1)

    const title = screen.getByRole("heading", { level: 2, name: "Typing test" })
    expect(title).toHaveAttribute("id", "tool-title")
    expect(screen.getByRole("region", { name: "Typing test" })).toHaveTextContent("How many words a minute you type")
  })

  it("marks no tool before the URL is read", () => {
    render(<ToolCabinet tab={null} />)
    expect(screen.queryByRole("link", { current: "page" })).not.toBeInTheDocument()
  })
})

describe("ToolShell", () => {
  it("opens the tool that ?tab= names", () => {
    search = new URLSearchParams("tab=web3-crypto")
    render(<ToolShell />)
    expect(screen.getByRole("link", { current: "page" })).toHaveAttribute("href", "/tools?tab=web3-crypto")
  })

  it("opens the Pokédex when ?tab= is missing or unknown", () => {
    for (const query of ["", "tab=nope"]) {
      search = new URLSearchParams(query)
      const { unmount } = render(<ToolShell />)
      expect(screen.getByRole("heading", { level: 2, name: "Pokédex" })).toBeInTheDocument()
      unmount()
    }
  })
})
