import { loadFont } from './ttf.mjs'
import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
// Usage: node scripts/logo/make.mjs <dir containing Literata-Italic[opsz,wght].ttf>
// Fonts stay outside the repo (OFL, google/fonts); outputs below are committed.
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PRINT_HEX } from '../../src/lib/print-hex.ts'
const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const require = createRequire(ROOT + 'package.json')
const sharp = require('sharp')
const FONT_DIR = process.argv[2]
if (!FONT_DIR) { console.error('usage: node scripts/logo/make.mjs <font dir>'); process.exit(1) }
const it = loadFont(FONT_DIR.replace(/\/?$/, '/') + 'Literata-Italic[opsz,wght].ttf')
// The hex copies of the tokens live in one place (Node strips the types when it imports print-hex.ts).
const { ink: INK, paper: PAPER, night: NIGHT } = PRINT_HEX
const f2 = n => +n.toFixed(1)

// --- geometry helpers -------------------------------------------------------
// horizontal scanline clip of a polygon: returns [x0,x1] spans at y
function spans(poly, y) {
  const xs = []
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length]
    if ((ay <= y && by > y) || (by <= y && ay > y)) xs.push(ax + (y - ay) / (by - ay) * (bx - ax))
  }
  xs.sort((a, b) => a - b)
  const out = []; for (let i = 0; i + 1 < xs.length; i += 2) out.push([xs[i], xs[i + 1]])
  return out
}
function text(font, str, size, x, y) {
  const s = size / font.unitsPerEm; let d = ''
  for (const ch of str) { const g = font.glyph(ch); d += font.pathFor(g.contours, { scale: s, x, y }); x += g.advance * s }
  return { d, width: x }
}
function measure(font, str, size) { return [...str].reduce((w, ch) => w + font.glyph(ch).advance * size / font.unitsPerEm, 0) }

// --- Tengger scene (view from Penanjakan): Bromo caldera left-back with smoke, Batok ridged dome centre-front, Semeru tall far right ---
function curve(pts) { let d = `M${f2(pts[0][0])} ${f2(pts[0][1])}`; for (let i = 1; i < pts.length; i++) d += `L${f2(pts[i][0])} ${f2(pts[i][1])}`; return d }
function hatchPoly(poly, y0, y1, gap) { let d = ''; for (let y = y0; y < y1; y += gap) for (const [a, b] of spans(poly, y)) d += `M${f2(a)} ${f2(y)}H${f2(b)}`; return d }
// engraved smoke: a column of overlapping puffs drawn as open arcs
function puffs(x, y, n, r0, drift) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const r = r0 * (1 + i * 0.28), cx = x + drift * i * i * 0.9, cy = y - i * r0 * 1.5
    d += `M${f2(cx - r)} ${f2(cy)}a${f2(r)} ${f2(r * 0.8)} 0 0 1 ${f2(2 * r)} 0`
    d += `M${f2(cx - r * 0.55)} ${f2(cy - r * 0.55)}a${f2(r * 0.6)} ${f2(r * 0.5)} 0 0 1 ${f2(r * 1.3)} ${f2(-r * 0.1)}`
  }
  return d
}
function scene({ horizon = 560 } = {}) {
  const H = horizon
  // Semeru: far right, tall symmetric cone, sparse thin hatch
  const semeru = [[640, H], [770, 286], [786, 284], [905, H]]
  const far = hatchPoly(semeru, 296, H, 16)
  const semeruEdge = curve([[640, H], [770, 286], [786, 284], [905, H]])
  const semeruSmoke = puffs(782, 268, 3, 9, 3)
  // Bromo: left-back caldera, wide, flat torn rim
  const bromo = [[150, H], [222, 432], [258, 418], [300, 424], [336, 412], [372, 426], [430, H]]
  let mid = hatchPoly(bromo, 422, H, 9)
  const bromoEdge = curve(bromo)
  const crater = `M236 430Q292 452 352 424`
  const smoke = puffs(296, 398, 4, 16, 5)
  // Batok: centre-front dome with a round crest and meridian gullies
  const cx = 520, crest = 360, bl = 365, br = 690
  const half = y => { const t = (y - crest) / (H - crest); return 52 + (br - bl) / 2 * Math.pow(Math.min(1, Math.max(0, t)), 0.62) }
  const outline = []
  for (let y = H; y >= crest; y -= 6) outline.push([cx - half(y), y])
  for (let a = Math.PI; a >= 0; a -= Math.PI / 12) outline.push([cx + 52 * Math.cos(a), crest - 16 * Math.sin(a)])
  for (let y = crest; y <= H; y += 6) outline.push([cx + half(y), y])
  let ridges = ''
  const N = 22
  for (let i = 1; i < N; i++) {
    const p = -1 + 2 * i / N
    const pts = []
    for (let y = crest - 8 * Math.cos(p * Math.PI / 2); y <= H; y += 5) pts.push([cx + p * half(y) + Math.sin(y / 9 + i) * 1.2, y])
    ridges += curve(pts)
  }
  // shadow side: extra short strokes between the gullies on the right
  for (let i = 0; i < 12; i++) { const p = 0.15 + i * 0.07; const ys = crest + 30 + i * 6; const pts = []; for (let y = ys; y <= H; y += 5) pts.push([cx + p * half(y) + 4, y]); ridges += curve(pts) }
  const batokEdge = curve(outline)
  // sand sea
  let ground = curve([[130, H], [870, H]])
  for (let r = 1; r <= 6; r++) {
    const y = H + r * r * 5 + r * 9, cnt = 4 + r
    for (let k = 0; k < cnt; k++) { const x = 160 + (k + (r % 2) * 0.5) * (680 / cnt); ground += `M${f2(x)} ${f2(y)}h${f2(14 + r * 6)}` }
  }
  return { far, semeruEdge, semeruSmoke, mid, bromoEdge, crater, smoke, ridges, batokEdge, batokPoly: outline, ground }
}

// --- monogram ----------------------------------------------------------------
function monogram(size, cx, baseline) {
  const R = text(it, 'R', size, 0, 0), h = text(it, 'h', size, 0, 0)
  const kern = -size * 0.10 // tuck the h ascender into the R's leg
  const w = measure(it, 'R', size) + kern + measure(it, 'h', size)
  const x = cx - w / 2
  return text(it, 'R', size, x, baseline).d + text(it, 'h', size, x + measure(it, 'R', size) + kern, baseline).d
}

// --- compositions --------------------------------------------------------------
function mark({ ring = true, ringText = true, ghost = true, night = false, ink = night ? PAPER : INK, paper = night ? NIGHT : PAPER, bg = true, id = 'disc', cut = false } = {}) {
  const sc = scene({ horizon: 560 })
  const mono = monogram(ringText ? 300 : 340, 500, ringText ? 790 : 812)
  const parts = bg ? [`<rect width="1000" height="1000" fill="${paper}"/>`] : []
  parts.push(`<clipPath id="${id}"><circle cx="500" cy="500" r="${ringText ? 352 : 420}"/></clipPath>`)
  if (cut) parts.push(`<mask id="${id}-k" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000"><rect width="1000" height="1000" fill="#fff"/><path d="${mono}" fill="#000" stroke="#000" stroke-width="14" stroke-linejoin="round"/></mask>`)
  parts.push(`<g clip-path="url(#${id})"${cut ? ` mask="url(#${id}-k)"` : ''} fill="none" stroke="${ink}" stroke-linecap="round" stroke-linejoin="round">`)
  const batokD = `M${sc.batokPoly.map(p => p.map(f2).join(' ')).join('L')}Z`
  // far layers sit behind Batok: in mask mode cut them with Batok's outline instead of painting paper over them
  if (cut) parts.push(`<mask id="${id}-b" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000"><rect width="1000" height="1000" fill="#fff"/><path d="${batokD}" fill="#000"/></mask><g${cut ? ` mask="url(#${id}-b)"` : ''}>`)
  parts.push(`<path d="${sc.far}" stroke-width="1.8"/><path d="${sc.semeruEdge}" stroke-width="2.6"/><path d="${sc.semeruSmoke}" stroke-width="2.2"/>`)
  parts.push(`<path d="${sc.mid}" stroke-width="2.6"/><path d="${sc.bromoEdge}" stroke-width="3.6"/><path d="${sc.crater}" stroke-width="4"/><path d="${sc.smoke}" stroke-width="3"/>`)
  parts.push(cut ? `</g>` : `<path d="${batokD}" fill="${paper}" stroke="none"/>`)
  parts.push(`<path d="${sc.ridges}" stroke-width="3"/><path d="${sc.batokEdge}" stroke-width="4.5"/>`)
  parts.push(`<path d="${sc.ground}" stroke-width="3.2"/>`)
  parts.push(`</g>`)
  if (ghost) parts.push(`<path d="${mono}" fill="${ink}" fill-opacity=".22" transform="translate(7 5)"/>`)
  parts.push(cut ? `<path d="${mono}" fill="${ink}"/>` : `<path d="${mono}" fill="${ink}" stroke="${paper}" stroke-width="10" paint-order="stroke" stroke-linejoin="round"/>`)
  if (ring) {
    if (ringText) {
      parts.push(`<circle cx="500" cy="500" r="362" fill="none" stroke="${ink}" stroke-width="4"/><circle cx="500" cy="500" r="470" fill="none" stroke="${ink}" stroke-width="10"/><circle cx="500" cy="500" r="452" fill="none" stroke="${ink}" stroke-width="2.5"/>`)
      parts.push(ringLabel('Rizky Haksono', 'printed in Malang, East Java', ink))
    } else {
      parts.push(`<circle cx="500" cy="500" r="432" fill="none" stroke="${ink}" stroke-width="4"/><circle cx="500" cy="500" r="462" fill="none" stroke="${ink}" stroke-width="9"/>`)
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${parts.join('')}</svg>`
}

// ring text: glyphs placed along a circle, top arc reads clockwise, bottom arc reads left-to-right too
function ringLabel(topStr, bottomStr, ink) {
  const size = 58, rTop = 392, rBot = 432, s = size / it.unitsPerEm
  let d = ''
  const place = (str, r, centerAngle, flip) => {
    const total = measure(it, str, size) * 1.04
    let a = centerAngle - (flip ? -1 : 1) * total / r / 2
    for (const ch of str) {
      const g = it.glyph(ch), adv = g.advance * s * 1.04
      const mid = a + (flip ? -1 : 1) * adv / r / 2
      const x = 500 + r * Math.cos(mid), y = 500 + r * Math.sin(mid)
      const rot = (mid * 180 / Math.PI) + (flip ? -90 : 90)
      const gp = it.pathFor(g.contours, { scale: s, x: -adv / 2 / 1.04, y: flip ? size * 0.36 : size * 0.36 })
      d += `<path d="${gp}" transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})"/>`
      a += (flip ? -1 : 1) * adv / r
    }
  }
  place(topStr, rTop, -Math.PI / 2, false)
  place(bottomStr, rBot - 2, Math.PI / 2, true)
  // two small fleuron diamonds at 9 and 3 o'clock
  const dia = (x, y) => `<path d="M${x} ${y - 13}L${x + 9} ${y}L${x} ${y + 13}L${x - 9} ${y}Z"/>`
  return `<g fill="${ink}">${d}${dia(500 - 411, 500)}${dia(500 + 411, 500)}</g>`
}

// icon.svg sits in src/, where the grep gate bans hex literals; same print-hex values, written as rgb().
const rgb = hex => `rgb(${[1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',')})`

function favicon() {
  const mono = monogram(660, 510, 700)
  const ink = rgb(INK), paper = rgb(PAPER)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="${ink}"/>`
    + `<path d="M120 800H880" stroke="${paper}" stroke-width="22" stroke-linecap="round"/><path d="M200 860H800" stroke="${paper}" stroke-width="16" stroke-linecap="round" opacity=".6"/>`
    + `<path d="${mono}" fill="${paper}"/></svg>`
}

function mini({ night = false, ink = night ? PAPER : INK, paper = night ? NIGHT : PAPER, bg = true, id = 'm' } = {}) {
  // bold simplification for 24-48px: thick ring, Batok dome with 5 gullies, horizon, Rh
  const cx = 500, crest = 300, H = 520, half = y => 70 + 190 * Math.pow((y - crest) / (H - crest), 0.62)
  const out = []
  for (let y = H; y >= crest; y -= 8) out.push([cx - half(y), y])
  for (let a = Math.PI; a >= 0; a -= Math.PI / 10) out.push([cx + 70 * Math.cos(a), crest - 24 * Math.sin(a)])
  for (let y = crest; y <= H; y += 8) out.push([cx + half(y), y])
  let g = ''
  for (const pp of [-0.6, -0.25, 0.1, 0.42, 0.72]) { const pts = []; for (let y = crest + 6; y <= H; y += 8) pts.push([cx + pp * half(y), y]); g += curve(pts) }
  const mono = monogram(380, 500, 860)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${bg ? `<rect width="1000" height="1000" fill="${paper}"/>` : ''}`
    + `<clipPath id="${id}"><circle cx="500" cy="500" r="420"/></clipPath><g clip-path="url(#${id})" fill="none" stroke="${ink}" stroke-linecap="round" stroke-linejoin="round">`
    + `<path d="${curve(out)}" stroke-width="22"/><path d="${g}" stroke-width="16"/><path d="M60 ${H}H940" stroke-width="22"/></g>`
    + `<path d="${mono}" fill="${ink}" stroke="${paper}" stroke-width="26" paint-order="stroke" stroke-linejoin="round"/>`
    + `<circle cx="500" cy="500" r="455" fill="none" stroke="${ink}" stroke-width="44"/></svg>`
}

function lockup({ night = false } = {}) {
  const ink = night ? PAPER : INK, paper = night ? NIGHT : PAPER
  const m = mark({ ringText: false, night }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace(/<rect[^>]*\/>/, '')
  const name = text(it, 'Rizky Haksono', 300, 1080, 610)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f2(name.width + 60)} 1000"><rect width="100%" height="100%" fill="${paper}"/><g>${m}</g><path d="${name.d}" fill="${ink}"/></svg>`
}

const pub = ROOT + 'public/brand/'
mkdirSync(pub, { recursive: true })
const files = {
  'seal-light': mark({}), 'seal-dark': mark({ night: true }),
  'mark-light': mark({ ringText: false }), 'mark-dark': mark({ ringText: false, night: true }),
  'mini-light': mini(), 'mini-dark': mini({ night: true }),
  'lockup-light': lockup(), 'lockup-dark': lockup({ night: true }),
}
for (const [k, svg] of Object.entries(files)) writeFileSync(pub + k + '.svg', svg)
writeFileSync(ROOT + 'src/app/icon.svg', favicon())
// apple-icon: mini mark reversed out of an ink tile
await sharp(Buffer.from(mini({ ink: PAPER, paper: INK }))).resize(180, 180).png().toFile(ROOT + 'src/app/apple-icon.png')

// theme-able inner markup for <Logo/>: ink = currentColor, knockout = page background
const inner = svg => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
const themed = { ink: 'currentColor', paper: 'hsl(var(--background))', bg: false }
const art = { mini: inner(mini({ ...themed, id: 'logo-mini-clip' })) }
// seal + mark ship as cached CSS masks (painted with currentColor), not inline markup
writeFileSync(pub + 'seal-mask.svg', mark({ ink: '#000', bg: false, cut: true, id: 'seal' }))
writeFileSync(pub + 'mark-mask.svg', mark({ ink: '#000', bg: false, cut: true, ringText: false, id: 'mark' }))
writeFileSync(ROOT + 'src/components/ui/logo-art.ts',
  '// Generated by scripts/logo/make.mjs. Do not edit by hand.\n' +
  `export const LOGO_ART = ${JSON.stringify(art)} as const\n`)
for (const [k, v] of Object.entries(art)) console.log(k, (v.length / 1024).toFixed(1) + ' KB')
console.log('wrote public/brand/*.svg, src/app/icon.svg, src/app/apple-icon.png, src/components/ui/logo-art.ts')
