import { escapeJsonLd } from "@/lib/escape-json-ld"

describe("escapeJsonLd", () => {
  it("escapes less-than so a string cannot break out of a script element", () => {
    expect(escapeJsonLd({ headline: "</script><script>alert(1)" })).toBe(
      '{"headline":"\\u003c/script>\\u003cscript>alert(1)"}',
    )
  })
})
