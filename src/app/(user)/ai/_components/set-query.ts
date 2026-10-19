/** Sets or clears one query param in place. The native history API syncs with the App Router without a server round trip. */
export function setQuery(key: string, value?: string) {
  const url = new URL(window.location.href)
  if (value) url.searchParams.set(key, value)
  else url.searchParams.delete(key)
  if (url.href !== window.location.href) window.history.replaceState(null, "", url)
}
