// Rasterises src/app/icon.svg (the plain "R" placeholder, edited by hand) into the apple icon and favicon.
// Usage: bun scripts/logo/make.mjs. Outputs are committed; rerun after changing icon.svg.
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { THEME_HEX } from '../../src/lib/theme-hex.ts'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const sharp = createRequire(ROOT + 'package.json')('sharp')
const SVG = readFileSync(ROOT + 'src/app/icon.svg')

const written = []
const write = (rel, data) => { writeFileSync(ROOT + rel, data); written.push(`${rel} (${data.length} B)`) }
const render = size => sharp(SVG, { density: 72 * size / 64 }).resize(size, size)

// iOS rounds the corners itself and shows transparent ones as black, so the apple icon is a full square tile.
write('src/app/apple-icon.png', await render(180).flatten({ background: THEME_HEX.light.foreground }).png().toBuffer())

// PNG-in-ICO: ICONDIR (6 B), one 16 B ICONDIRENTRY per image, then the PNG blobs.
const icons = await Promise.all([16, 32].map(async size => ({ size, data: await render(size).png().toBuffer() })))
const head = Buffer.alloc(6 + 16 * icons.length)
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(icons.length, 4)
let offset = head.length
icons.forEach(({ size, data }, i) => {
  const e = 6 + 16 * i
  head.writeUInt8(size, e); head.writeUInt8(size, e + 1) // colour count and reserved stay 0
  head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6) // planes, bits per pixel
  head.writeUInt32LE(data.length, e + 8); head.writeUInt32LE(offset, e + 12)
  offset += data.length
})
write('src/app/favicon.ico', Buffer.concat([head, ...icons.map(i => i.data)]))
const ico = readFileSync(ROOT + 'src/app/favicon.ico')
if (!ico.subarray(0, 6).equals(Buffer.from([0, 0, 1, 0, 2, 0]))) throw new Error('favicon.ico header is not 00 00 01 00 02 00')

console.log('wrote\n  ' + written.join('\n  '))
