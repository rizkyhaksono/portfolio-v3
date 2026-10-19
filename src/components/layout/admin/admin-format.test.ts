import { formatDay, httpUrl, stripHtml, timeAgo } from "./admin-format"

describe("admin-format", () => {
  it("strips tags and decodes entities once", () => {
    expect(stripHtml("<p>Hello&nbsp;<strong>world</strong></p><p>&amp;lt; ok</p>")).toBe("Hello world &lt; ok")
    expect(stripHtml(null)).toBe("")
  })

  it("keeps only http(s) links", () => {
    expect(httpUrl("https://natee.my.id/blog")).toBe("https://natee.my.id/blog")
    expect(httpUrl("javascript:alert(1)")).toBeNull()
    expect(httpUrl("/blog")).toBeNull()
    expect(httpUrl("")).toBeNull()
  })

  it("writes relative times and datelines", () => {
    const now = Date.parse("2026-10-19T12:00:00Z")
    expect(timeAgo("2026-10-19T09:00:00Z", now)).toBe("3 hours ago")
    expect(timeAgo("2026-10-19T11:59:40Z", now)).toBe("just now")
    expect(timeAgo("not a date", now)).toBe("")
    expect(formatDay("2026-10-18T20:00:00Z")).toBe("19 October 2026")
    expect(formatDay(null)).toBe("")
  })
})
