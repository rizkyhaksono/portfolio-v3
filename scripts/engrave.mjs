// Prints the one-ink plates and paper textures (plan §4).
// Usage: bun scripts/engrave.mjs <path/to/hollar-landschap-met-ruiter-1650.jpg> [<path/to/impressio-librorum-3840.jpg>] > speckle-uri.txt
// Sources: Wenceslaus Hollar after Jan Wildens, Landscape with a Rider, 1650, Rijksmuseum RP-P-OB-11.335 (CC0);
// Impressio librorum, Nova Reperta, after Jan van der Straet, publ. Galle, c. 1600, Museum Plantin-Moretus PK.OPB.0186.005 (PDM).
// The source scans live in art-src/ outside the repo and are never committed.
// Writes src/assets/plates/hollar-band-1600.webp, press-<w>.webp (when the second scan is given) and
// src/assets/paper/grain-{light,dark}.webp, prints the speckle mask data URI to stdout (sizes go to stderr).
// Exits non-zero if any budget is blown.
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const [src, pressSrc] = process.argv.slice(2)
if (!src || !fs.existsSync(src) || (pressSrc && !fs.existsSync(pressSrc))) {
  console.error("usage: bun scripts/engrave.mjs <hollar-landschap-met-ruiter-1650.jpg> [<impressio-librorum-3840.jpg>]")
  process.exit(2)
}

const root = path.join(import.meta.dirname, "..")
const KB = 1024
const INK = [0x1e, 0x3c, 0x9e] // --ink, light
const CREAM = [0xef, 0xe6, 0xd2] // --ink, dark (cream)
const CROP = { left: 330, top: 1500, width: 6150, height: 2620 } // excludes the plate caption line
const THRESHOLD = 140
// Press, both pressmen, the paper carrier and the proofreader; inside the plate border, above the signatures and caption.
const PRESS_CROP = { left: 1790, top: 115, width: 1870, height: 2300 }
const PRESS_THRESHOLD = 130
const PRESS_WIDTH = 800 // 2.7x its widest render (~300 CSS px from lg); at 1200 the hatching costs ~165 KB

// Smallest of lossless + lossy [80,70,60]; throws (non-zero exit) when even that is over budget.
async function encode(rgba, width, height, budget, label) {
  const img = sharp(rgba, { raw: { width, height, channels: 4 } })
  const tries = [{ lossless: true }, ...[80, 70, 60].map((q) => ({ quality: q, alphaQuality: q }))]
  let best
  for (const opt of tries) {
    const buf = await img.clone().webp({ ...opt, effort: 6 }).toBuffer()
    if (!best || buf.length < best.buf.length) best = { buf, opt }
  }
  const size = (best.buf.length / KB).toFixed(1)
  assert.ok(best.buf.length <= budget, `${label}: ${size} KB is over the ${budget / KB} KB budget`)
  console.error(`${label}  ${width}x${height}  ${size} KB  ${JSON.stringify(best.opt)}`)
  return best.buf
}

// One colour everywhere; the picture lives in alpha (CSS mask / grain overlay).
function tint([r, g, b], alpha) {
  const out = Buffer.alloc(alpha.length * 4)
  for (let i = 0; i < alpha.length; i++) out.set([r, g, b, alpha[i]], i * 4)
  return out
}

async function write(rel, buf) {
  const file = path.join(root, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, buf)
}

// --- Plates -----------------------------------------------------------------
// Greyscale via max(R,G,B) so any hand colouring or paper stain reads as paper, not ink.
async function engrave(file, crop, threshold, sizes, name) {
  const { data, info } = await sharp(file).extract(crop).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const gray = Buffer.alloc(info.width * info.height)
  for (let i = 0, j = 0; j < gray.length; i += info.channels, j++) gray[j] = Math.max(data[i], data[i + 1], data[i + 2])

  for (const [width, budget] of sizes) {
    const plate = await sharp(gray, { raw: { width: info.width, height: info.height, channels: 1 } })
      .resize({ width })
      .normalise({ lower: 2, upper: 98 })
      .sharpen({ sigma: 0.6 })
      .extractChannel(0) // sharp raw output is otherwise 3-channel
      .threshold(threshold)
      .raw()
      .toBuffer({ resolveWithObject: true })
    assert.equal(plate.info.channels, 1, "plate mask must be single-channel")
    const ink = plate.data.map((v) => 255 - v) // dark line = opaque ink
    const buf = await encode(tint(INK, ink), plate.info.width, plate.info.height, budget, `${name}-${width}`)
    await write(`src/assets/plates/${name}-${width}.webp`, buf)
  }
}

await engrave(src, CROP, THRESHOLD, [[1600, 72 * KB]], "hollar-band")
if (pressSrc) await engrave(pressSrc, PRESS_CROP, PRESS_THRESHOLD, [[PRESS_WIDTH, 70 * KB]], "press")

// --- Paper textures ---------------------------------------------------------
// Seeded so re-runs give byte-identical tiles. Per-pixel noise is seamless when tiled.
const TILE = 128
let seed = 0x1650
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const gauss = () => (rand() + rand() + rand() + rand() - 2) * Math.sqrt(3) // Irwin-Hall, ~N(0,1)

// Grain: faint specks only on the upper tail, alpha stepped by 4 to keep the tile tiny.
const grain = Uint8Array.from({ length: TILE * TILE }, () => {
  const g = gauss()
  return g > 0.8 ? Math.min(96, Math.round(((g - 0.8) * 28) / 4) * 4) : 0
})
await write("src/assets/paper/grain-light.webp", await encode(tint(INK, grain), TILE, TILE, 4 * KB, "grain-light"))
await write("src/assets/paper/grain-dark.webp", await encode(tint(CREAM, grain), TILE, TILE, 4 * KB, "grain-dark"))

// Speckle mask: opaque with small holes where the ink "did not take". 3x3 wrap-around blur keeps it seamless.
const noise = Float32Array.from({ length: TILE * TILE }, gauss)
const holes = new Uint8Array(TILE * TILE)
for (let y = 0; y < TILE; y++)
  for (let x = 0; x < TILE; x++) {
    let s = 0
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) s += noise[((y + dy + TILE) % TILE) * TILE + ((x + dx + TILE) % TILE)]
    holes[y * TILE + x] = s / 3 > 1.6 ? 0 : 255 // s/3 ~ N(0,1): ~5% holes, in small clumps
  }
const speckle = await encode(tint([0, 0, 0], holes), TILE, TILE, 3 * KB, "speckle")
const uri = `data:image/webp;base64,${speckle.toString("base64")}`
assert.ok(uri.length <= 4 * KB, `speckle data URI is ${uri.length} B, over 4 KB`)
console.error(`speckle data URI  ${uri.length} B`)
console.log(uri)
