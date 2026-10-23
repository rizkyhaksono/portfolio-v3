import { NextRequest } from "next/server"
import { serverApiUrl } from "@/lib/api-base"
import { getSessionToken } from "@/lib/session"
import { apiProxyHeaders } from "@/lib/trusted-client-ip"

export const dynamic = "force-dynamic"

const SEGMENT = /^[\w~-][\w.~-]*$/
const PASSED_HEADERS = ["content-type", "cache-control", "content-disposition"]

type Context = { params: Promise<{ path: string[] }> }

/** Browser calls that need the session reach the API through here, so the token cookie can stay httpOnly. */
async function forward(req: NextRequest, { params }: Context) {
  const { path } = await params
  if (!path.every((segment) => SEGMENT.test(segment))) {
    return Response.json({ message: "Not found." }, { status: 404 })
  }

  const site = req.headers.get("sec-fetch-site")
  if (req.method !== "GET" && site && site !== "same-origin") {
    return Response.json({ message: "Cross-site requests are not allowed." }, { status: 403 })
  }

  const apiUrl = serverApiUrl()
  if (!apiUrl) return Response.json({ message: "Service is not configured." }, { status: 503 })

  const headers: Record<string, string> = apiProxyHeaders(req.headers)
  const contentType = req.headers.get("content-type")
  if (contentType) headers["content-type"] = contentType
  const token = await getSessionToken()
  if (token) headers.authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${apiUrl}/v3/${path.join("/")}${req.nextUrl.search}`, {
      method: req.method,
      headers,
      body: req.method === "GET" ? undefined : await req.arrayBuffer(),
      cache: "no-store",
      signal: AbortSignal.any([req.signal, AbortSignal.timeout(60_000)]),
    })
  } catch {
    return Response.json({ message: "The API did not answer. Try again in a minute." }, { status: 502 })
  }

  const out = new Headers()
  for (const name of PASSED_HEADERS) {
    const value = res.headers.get(name)
    if (value) out.set(name, value)
  }
  return new Response(res.body, { status: res.status, headers: out })
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE }
