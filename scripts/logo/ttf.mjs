// Minimal TrueType reader: cmap (4/12), hmtx, loca, glyf (simple + composite) -> SVG path data.
// Reads the default master of a variable font (no gvar), which is enough for a logo.
import { readFileSync } from 'node:fs'

export function loadFont(path) {
  const b = readFileSync(path)
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength)
  const u16 = o => dv.getUint16(o), i16 = o => dv.getInt16(o), u32 = o => dv.getUint32(o)
  const tables = {}
  const n = u16(4)
  for (let i = 0; i < n; i++) {
    const r = 12 + i * 16
    tables[String.fromCharCode(b[r], b[r + 1], b[r + 2], b[r + 3])] = u32(r + 8)
  }
  const head = tables.head, unitsPerEm = u16(head + 18), indexToLocFormat = i16(head + 50)
  const numGlyphs = u16(tables.maxp + 4)
  const hhea = tables.hhea, ascender = i16(hhea + 4), descender = i16(hhea + 6), numHMetrics = u16(hhea + 34)
  const advance = gid => u16(tables.hmtx + 4 * Math.min(gid, numHMetrics - 1))
  const loca = gid => indexToLocFormat ? u32(tables.loca + gid * 4) : u16(tables.loca + gid * 2) * 2

  // cmap
  const cmapOff = tables.cmap, nSub = u16(cmapOff + 2)
  let sub = null
  for (let i = 0; i < nSub; i++) {
    const pid = u16(cmapOff + 4 + i * 8), eid = u16(cmapOff + 6 + i * 8), off = u32(cmapOff + 8 + i * 8)
    const fmt = u16(cmapOff + off)
    if (pid === 3 && (eid === 10 || eid === 1) && (fmt === 12 || fmt === 4)) { if (!sub || fmt === 12) sub = cmapOff + off }
  }
  function gidOf(cp) {
    const fmt = u16(sub)
    if (fmt === 12) {
      const nG = u32(sub + 12)
      for (let i = 0; i < nG; i++) { const s = u32(sub + 16 + i * 12), e = u32(sub + 20 + i * 12), g = u32(sub + 24 + i * 12); if (cp >= s && cp <= e) return g + cp - s }
      return 0
    }
    const segX2 = u16(sub + 6), ends = sub + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ranges = deltas + segX2
    for (let i = 0; i < segX2 / 2; i++) {
      const e = u16(ends + i * 2), s = u16(starts + i * 2)
      if (cp >= s && cp <= e) {
        const d = i16(deltas + i * 2), ro = u16(ranges + i * 2)
        if (!ro) return (cp + d) & 0xffff
        const g = u16(ranges + i * 2 + ro + (cp - s) * 2)
        return g ? (g + d) & 0xffff : 0
      }
    }
    return 0
  }

  // glyf -> contours of {x,y,on}
  function contours(gid, m = [1, 0, 0, 1, 0, 0]) {
    const start = loca(gid), end = loca(gid + 1)
    if (start === end) return []
    const g = tables.glyf + start, nc = i16(g)
    const tf = ([a, b, c, d, e, f], x, y) => ({ x: a * x + c * y + e, y: b * x + d * y + f })
    if (nc >= 0) {
      const endPts = []; for (let i = 0; i < nc; i++) endPts.push(u16(g + 10 + i * 2))
      const nPts = endPts[nc - 1] + 1
      let p = g + 10 + nc * 2; const insLen = u16(p); p += 2 + insLen
      const flags = []
      while (flags.length < nPts) { const f = b[p++]; flags.push(f); if (f & 8) { let r = b[p++]; while (r--) flags.push(f) } }
      const xs = [], ys = []; let v = 0
      for (const f of flags) { if (f & 2) { const d = b[p++]; v += f & 16 ? d : -d } else if (!(f & 16)) { v += i16(p); p += 2 } xs.push(v) }
      v = 0
      for (const f of flags) { if (f & 4) { const d = b[p++]; v += f & 32 ? d : -d } else if (!(f & 32)) { v += i16(p); p += 2 } ys.push(v) }
      const out = []; let s = 0
      for (const e of endPts) { const c = []; for (let i = s; i <= e; i++) c.push({ ...tf(m, xs[i], ys[i]), on: !!(flags[i] & 1) }); out.push(c); s = e + 1 }
      return out
    }
    // composite
    let p = g + 10, out = [], more = true
    while (more) {
      const flags = u16(p), cg = u16(p + 2); p += 4
      let dx, dy
      if (flags & 1) { dx = i16(p); dy = i16(p + 2); p += 4 } else { dx = dv.getInt8(p); dy = dv.getInt8(p + 1); p += 2 }
      let a = 1, bb = 0, c = 0, d = 1
      const f2 = o => dv.getInt16(o) / 16384
      if (flags & 8) { a = d = f2(p); p += 2 } else if (flags & 0x40) { a = f2(p); d = f2(p + 2); p += 4 } else if (flags & 0x80) { a = f2(p); bb = f2(p + 2); c = f2(p + 4); d = f2(p + 6); p += 8 }
      const [ma, mb, mc, md, me, mf] = m
      const nm = [ma * a + mc * bb, mb * a + md * bb, ma * c + mc * d, mb * c + md * d, ma * dx + mc * dy + me, mb * dx + md * dy + mf]
      out = out.concat(contours(cg, nm))
      more = !!(flags & 0x20)
    }
    return out
  }

  // contours -> SVG path (y flipped, scaled, translated)
  function pathFor(cs, { scale = 1, x = 0, y = 0 } = {}) {
    const P = pt => `${(x + pt.x * scale).toFixed(2)} ${(y - pt.y * scale).toFixed(2)}`
    let d = ''
    for (const c of cs) {
      if (!c.length) continue
      let pts = c.slice()
      const firstOn = pts.findIndex(q => q.on)
      let startPt
      if (firstOn === -1) { startPt = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2, on: true } } else { pts = pts.slice(firstOn).concat(pts.slice(0, firstOn)); startPt = pts.shift() }
      d += `M${P(startPt)}`
      let ctrl = null
      for (const q of pts.concat([startPt])) {
        if (q.on) { d += ctrl ? `Q${P(ctrl)} ${P(q)}` : `L${P(q)}`; ctrl = null }
        else if (ctrl) { const mid = { x: (ctrl.x + q.x) / 2, y: (ctrl.y + q.y) / 2 }; d += `Q${P(ctrl)} ${P(mid)}`; ctrl = q }
        else ctrl = q
      }
      d += 'Z'
    }
    return d
  }

  return {
    unitsPerEm, ascender, descender, numGlyphs,
    glyph(ch) { const gid = gidOf(ch.codePointAt(0)); return { gid, advance: advance(gid), contours: contours(gid) } },
    pathFor,
    bbox(cs) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const c of cs) for (const q of c) { x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y); x1 = Math.max(x1, q.x); y1 = Math.max(y1, q.y) } return { x0, y0, x1, y1 } },
  }
}
