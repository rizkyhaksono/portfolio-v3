import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"

import { getAnimeImage, getAnimeQuote } from "@/services/visitor/anime"
import { AnimeGeneratorTab } from "./anime-generator-tab"

jest.mock("@/services/visitor/anime")

const image = jest.mocked(getAnimeImage)
const quote = jest.mocked(getAnimeQuote)
const png = () => new Blob(["x"], { type: "image/png" })

let urls = 0
beforeEach(() => {
  jest.resetAllMocks()
  urls = 0
  URL.createObjectURL = jest.fn(() => `blob:anime-${++urls}`)
  URL.revokeObjectURL = jest.fn()
})

describe("AnimeGeneratorTab images", () => {
  it("fetches the chosen category once and shows the picture", async () => {
    image.mockResolvedValue(png())
    render(<AnimeGeneratorTab />)

    await userEvent.click(screen.getByRole("button", { name: "Neko" }))
    await userEvent.click(screen.getByRole("button", { name: "Generate image" }))

    expect(await screen.findByRole("img", { name: /neko/i })).toHaveAttribute("src", "blob:anime-1")
    expect(image).toHaveBeenCalledTimes(1)
    expect(image.mock.calls[0][0]).toBe("neko")
    expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute("download", "anime-neko.png")
  })

  it("tags the button for analytics with the category, never anything personal", async () => {
    render(<AnimeGeneratorTab />)
    await userEvent.click(screen.getByRole("button", { name: "Dance" }))

    const generate = screen.getByRole("button", { name: "Generate image" })
    expect(generate).toHaveAttribute("data-umami-event", "anime-generate")
    expect(generate).toHaveAttribute("data-umami-event-category", "dance")
  })

  it("shows an inline error when the fetch fails, and no picture", async () => {
    image.mockRejectedValue(new Error("Failed to fetch anime image"))
    render(<AnimeGeneratorTab />)

    await userEvent.click(screen.getByRole("button", { name: "Generate image" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(/did not load/i)
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  it("revokes the old object URL when a new picture replaces it, and on unmount", async () => {
    image.mockImplementation(async () => png())
    const { unmount } = render(<AnimeGeneratorTab />)
    const generate = screen.getByRole("button", { name: "Generate image" })

    await userEvent.click(generate)
    await screen.findByRole("img")
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()

    await userEvent.click(generate)
    await screen.findByRole("img", { name: /cringe/i })
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:anime-1")

    unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:anime-2")
  })
})

describe("AnimeGeneratorTab quotes", () => {
  it("shows the quote with its character and anime", async () => {
    quote.mockResolvedValue({ content: "Power comes in response to a need.", anime: { name: "Dragon Ball Z" }, character: { name: "Goku" } })
    render(<AnimeGeneratorTab />)

    await userEvent.click(screen.getByRole("tab", { name: "Quotes" }))
    const button = screen.getByRole("button", { name: "Get a quote" })
    expect(button).toHaveAttribute("data-umami-event", "anime-quote")
    await userEvent.click(button)

    expect(await screen.findByText(/Power comes in response/)).toBeInTheDocument()
    expect(screen.getByText(/Goku/)).toBeInTheDocument()
    expect(screen.getByText(/Dragon Ball Z/)).toBeInTheDocument()
  })

  it.each([
    ["Too many requests", /limit resets in about an hour/],
    ["Failed to fetch anime quote", /did not load/],
  ])("explains a failed quote (%s) inline", async (message, text) => {
    quote.mockRejectedValue(new Error(message))
    render(<AnimeGeneratorTab />)

    await userEvent.click(screen.getByRole("tab", { name: "Quotes" }))
    await userEvent.click(screen.getByRole("button", { name: "Get a quote" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(text)
  })
})
