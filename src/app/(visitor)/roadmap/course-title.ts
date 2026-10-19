/** "mcp-fundamentals" → "MCP fundamentals". Sentence case; MCP is the one acronym among the course ids. */
export const courseTitle = (id = "") =>
  id
    .replace(/-/g, " ")
    .replace(/^mcp\b/, "MCP")
    .replace(/^\w/, (first) => first.toUpperCase())

/** "15 min" → 15; anything unreadable counts as 0. */
export const minutesOf = (duration?: string) => Number.parseInt(duration ?? "", 10) || 0
