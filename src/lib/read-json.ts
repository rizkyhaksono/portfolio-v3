import type { z } from "zod"

type ReadResult<T> = { ok: true; data: T } | { ok: false; status: 400 | 413 }

/** Parses a JSON body against `schema`, refusing more than `maxBytes` whatever Content-Length claims. */
export async function readJson<T>(req: Request, schema: z.ZodType<T>, maxBytes: number): Promise<ReadResult<T>> {
  if (Number(req.headers.get("content-length") ?? 0) > maxBytes) return { ok: false, status: 413 }
  const reader = req.body?.getReader()
  if (!reader) return { ok: false, status: 400 }

  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBytes) {
      await reader.cancel()
      return { ok: false, status: 413 }
    }
    chunks.push(value)
  }

  try {
    const parsed = schema.safeParse(JSON.parse(Buffer.concat(chunks).toString("utf8")))
    return parsed.success ? { ok: true, data: parsed.data } : { ok: false, status: 400 }
  } catch {
    return { ok: false, status: 400 }
  }
}
