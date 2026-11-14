/**
 * Serializes JSON-LD for inline script injection without `</script>` breakout.
 */
export function escapeJsonLd(data: unknown): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c")
}
