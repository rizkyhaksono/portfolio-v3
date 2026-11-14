import { ImageResponse } from "next/og"
import { JOB_TITLE } from "@/commons/constants/author"
import { THEME_HEX } from "@/lib/theme-hex"
import { CARD_HEADERS, loadPrintAssets, RULE_HEX } from "./print-assets"

// Node, not edge: the font is a file read from disk.
export const runtime = "nodejs"

const { background, foreground, mutedForeground } = THEME_HEX.light

const SECTION: Record<string, string> = {
  blog: "Writing",
  project: "Projects",
  changelog: "Changelog",
  roadmap: "Roadmap",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get("title") || "Rizky Haksono").slice(0, 140)
  const subtitle = (searchParams.get("subtitle") ?? "").slice(0, 180)
  const section = SECTION[(searchParams.get("type") ?? "").toLowerCase()] ?? "Portfolio"

  try {
    const { font } = await loadPrintAssets()

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 72px",
            backgroundColor: background,
            color: foreground,
            fontFamily: "Plus Jakarta Sans",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 34 }}>Rizky Haksono</span>
            <span style={{ fontSize: 22, color: mutedForeground }}>{JOB_TITLE}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: title.length > 90 ? 52 : title.length > 50 ? 64 : 76, lineHeight: 1.05 }}>{title}</div>
            {subtitle ? (
              <div style={{ display: "block", fontSize: 28, lineHeight: 1.35, color: mutedForeground, lineClamp: 2 }}>{subtitle}</div>
            ) : null}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, fontSize: 24, color: mutedForeground, borderTop: `1px solid ${RULE_HEX}` }}>
            <span>{section}</span>
            <span>natee.my.id</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [{ name: "Plus Jakarta Sans", data: font, style: "normal", weight: 600 }],
        headers: CARD_HEADERS,
      },
    )
  } catch (error) {
    console.error("og image failed", error)
    return new Response("Failed to generate image", { status: 500 })
  }
}
