import { loadPrintAssets } from "./print-assets"

it("loads IBM Plex Sans 400 and 600 as WOFF and the mark as an SVG data URI", async () => {
  const { fonts, mark } = await loadPrintAssets()

  expect(fonts.map(({ name, weight, style }) => [name, weight, style])).toEqual([
    ["IBM Plex Sans", 400, "normal"],
    ["IBM Plex Sans", 600, "normal"],
  ])
  for (const { data } of fonts) expect(data.subarray(0, 4).toString("latin1")).toBe("wOFF")
  expect(mark.startsWith("data:image/svg+xml;base64,")).toBe(true)
})
