import { ogImageUrl } from "@/lib/site-url"

const parse = (url: string) => new URL(url, "https://natee.my.id")

describe("ogImageUrl", () => {
  it("builds a relative /api/og URL with the cache-busting version", () => {
    const url = ogImageUrl({ type: "blog", title: "x" })

    expect(url.startsWith("/api/og?")).toBe(true)
    expect(parse(url).searchParams.get("v")).toBe("3")
  })

  it("round-trips awkward values and ignores a caller-supplied v", () => {
    const { searchParams } = parse(ogImageUrl({ title: "Q&A: 100% #1", subtitle: "", v: "1" }))

    expect(searchParams.get("title")).toBe("Q&A: 100% #1")
    expect(searchParams.get("subtitle")).toBe("")
    expect(searchParams.getAll("v")).toEqual(["3"])
  })

  it("serves the certificate from the same helper", () => {
    const url = parse(ogImageUrl({ course: "mcp-fundamentals", name: "Ada" }, "/api/certificate"))

    expect(url.pathname).toBe("/api/certificate")
    expect(url.searchParams.get("v")).toBe("3")
  })
})
