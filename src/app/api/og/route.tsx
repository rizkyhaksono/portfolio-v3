import { ImageResponse } from "next/og"
import { JOB_TITLE } from "@/commons/constants/author"
import { PRINT_HEX } from "@/lib/print-hex"
import { CARD_HEADERS, loadPrintAssets, RULE_HEX } from "./print-assets"

// Node, not edge: the font and the mark are files read from disk.
export const runtime = "nodejs"

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
    const { font, mark } = await loadPrintAssets()

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
            backgroundColor: PRINT_HEX.paper,
            color: PRINT_HEX.ink,
            fontFamily: "Literata",
            fontStyle: "italic",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} width={126} height={112} alt="" />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 34 }}>Rizky Haksono</span>
              <span style={{ fontSize: 22, color: PRINT_HEX.inkSoft }}>{JOB_TITLE}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: title.length > 90 ? 52 : title.length > 50 ? 64 : 76, lineHeight: 1.05 }}>{title}</div>
            {subtitle ? (
              <div style={{ display: "block", fontSize: 28, lineHeight: 1.35, color: PRINT_HEX.inkSoft, lineClamp: 2 }}>{subtitle}</div>
            ) : null}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* The double rule under every printed page head: ink, a 3px gap, a hairline. */}
            <div style={{ display: "flex", height: 5, borderTop: `1px solid ${PRINT_HEX.ink}`, borderBottom: `1px solid ${RULE_HEX}` }} />
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, fontSize: 24, color: PRINT_HEX.inkSoft }}>
              <span>{section}</span>
              <span>natee.my.id</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [{ name: "Literata", data: font, style: "italic", weight: 400 }],
        headers: CARD_HEADERS,
      },
    )
  } catch (error) {
    console.error("og image failed", error)
    return new Response("Failed to generate image", { status: 500 })
  }
}
