import { isSiteImage } from "@/lib/site-url"

describe("isSiteImage", () => {
  it("treats site paths and the canonical origin as site images", () => {
    expect(isSiteImage("/api/og?type=blog&title=x")).toBe(true)
    expect(isSiteImage("https://natee.my.id/api/og?type=blog&title=x")).toBe(true)
  })

  it("leaves other hosts to the image optimizer", () => {
    expect(isSiteImage("https://media2.dev.to/cover.png")).toBe(false)
    expect(isSiteImage("https://natee.my.id.evil.example/x.png")).toBe(false)
  })
})
