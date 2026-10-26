// Prints the plates and the paper textures.
// Usage: bun scripts/engrave.mjs <path/to/bromo-greive-salm-1869.jpg> [<path/to/hollar-landschap-met-ruiter-1650.jpg>] > speckle-uri.txt
// Sources: Johan Conrad Greive after Abraham Salm, Gezicht op de Bromo vulkaan, 1869, Rijksmuseum RP-P-1975-194
// (public domain), for the home hero; Wenceslaus Hollar after Jan Wildens, Landscape with a Rider, 1650, Rijksmuseum
// RP-P-OB-11.335 (CC0), for the colophon band. The scans live in art-src/ outside the repo and are never committed.
// Writes src/assets/plates/bromo-<w>.webp, hollar-band-1600.webp (when the second scan is given) and
// src/assets/paper/grain-{light,dark}.webp, prints the speckle mask data URI to stdout (sizes go to stderr).
// Exits non-zero if any budget is blown.
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const [src, hollarSrc] = process.argv.slice(2)
if (!src || !fs.existsSync(src) || (hollarSrc && !fs.existsSync(hollarSrc))) {
  console.error("usage: bun scripts/engrave.mjs <bromo-greive-salm-1869.jpg> [<hollar-landschap-met-ruiter-1650.jpg>]")
  process.exit(2)
}

const root = path.join(import.meta.dirname, "..")
const KB = 1024
const INK = [0x1e, 0x3c, 0x9e] // --ink, light
const PAPER = [0xf3, 0xec, 0xdc] // --paper, light
const CREAM = [0xef, 0xe6, 0xd2] // --ink, dark (cream)
const CROP = { left: 300, top: 270, width: 6320, height: 4570 } // the picture inside the mat, pencil number and label
const HOLLAR_CROP = { left: 330, top: 1500, width: 6150, height: 2620 } // excludes the plate caption line
const HOLLAR_THRESHOLD = 140

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

// --- Hero plate ---------------------------------------------------------------
// The lithograph is tone, not line, so it is re-cut as an engraving: a horizontal line screen whose lines
// thicken with darkness and bend with the broad tones (contour hatching), plus solid ink wherever a pixel is
// much darker than its surroundings (riders, rocks, shadow edges). The sky is cut away (transparent), so the
// hero's dotted cobalt shows through above the ridge.
const PERIOD = 6 // line pitch in px at 1600 wide; scaled with the width
const BEND = 50 // how far broad tones bend the lines, px at 1600
const DETAIL = 14 // darker than the 5px neighbourhood by this much = solid ink

// Skyline as a fraction of the height per column: walk down from just under the clouds until the colour
// breaks from the running sky colour, then median- and box-smooth across columns.
async function skyline(width) {
  const w = 800
  const { data, info } = await sharp(src).extract(CROP).resize(w).blur(1.2).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const h = info.height
  const px = (x, y, c) => data[(y * w + x) * 3 + c]
  const ridge = Array.from({ length: w }, (_, x) => {
    let y = Math.round(h * 0.47)
    const avg = [0, 1, 2].map((c) => px(x, y, c))
    for (let run = 0; y < h * 0.62; y++) {
      const d = Math.max(...[0, 1, 2].map((c) => Math.abs(px(x, y, c) - avg[c])))
      if (d <= 14) {
        run = 0
        for (let c = 0; c < 3; c++) avg[c] = avg[c] * 0.85 + px(x, y, c) * 0.15
      } else if (++run >= 3) {
        y -= 2
        break
      }
    }
    return y / h
  })
  const median = ridge.map((_, x) => ridge.slice(Math.max(0, x - 8), x + 9).sort((a, b) => a - b)[8] ?? ridge[x])
  const smooth = median.map((_, x) => {
    const win = median.slice(Math.max(0, x - 3), x + 4)
    return win.reduce((a, b) => a + b) / win.length
  })
  return Array.from({ length: width }, (_, x) => smooth[Math.min(w - 1, Math.round((x / width) * w))])
}

async function bromo(width, budget) {
  const k = width / 1600
  const gray = (img) => img.extract(CROP).resize(width).greyscale()
  const tone = await gray(sharp(src)).clahe({ width: 50, height: 50, maxSlope: 4 }).normalise({ lower: 1, upper: 99 }).raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = tone.info
  const base = await gray(sharp(src)).normalise({ lower: 1, upper: 99 }).raw().toBuffer()
  const local = await sharp(base, { raw: { width: W, height: H, channels: 1 } }).blur(5 * k).extractChannel(0).raw().toBuffer()
  const soft = await gray(sharp(src)).blur(18 * k).extractChannel(0).raw().toBuffer()
  for (const buf of [tone.data, base, local, soft]) assert.equal(buf.length, W * H, "plate layers must be single-channel")

  const ridge = (await skyline(W)).map((r) => r * H)
  const top = Math.max(0, Math.floor(Math.min(...ridge)) - Math.round(8 * k)) // drop the empty sky above the peaks
  const rows = H - top
  const rgba = Buffer.alloc(W * rows * 4)
  for (let y = top; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x
      const o = ((y - top) * W + x) * 4
      if (y < ridge[x]) continue // transparent sky (zeroed buffer)
      const dark = Math.pow(Math.max(0, (1 - tone.data[i] / 255 - 0.25) / 0.75), 1.5) * 0.5
      const wobble = Math.sin(x / (37 * k) + y / (211 * k)) * 0.6 * k + Math.sin(x / (13.7 * k)) * 0.25 * k
      const yy = y + (soft[i] / 255) * BEND * k + wobble
      const screen = (1 - Math.cos((2 * Math.PI * yy) / (PERIOD * k))) / 2 // 0 on a line's centre
      const ink = screen < dark || local[i] - base[i] > DETAIL
      rgba.set([...(ink ? INK : PAPER), 255], o)
    }
  const buf = await encode(rgba, W, rows, budget, `bromo-${width}`)
  await write(`src/assets/plates/bromo-${width}.webp`, buf)
}

await bromo(2400, 180 * KB)

// --- Colophon band -----------------------------------------------------------------
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

if (hollarSrc) await engrave(hollarSrc, HOLLAR_CROP, HOLLAR_THRESHOLD, [[1600, 72 * KB]], "hollar-band")

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
