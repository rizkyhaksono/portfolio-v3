"use client"

import dynamic from "next/dynamic"

// A client-side dynamic import, so the chat (and its markdown renderer) is an async chunk that only
// signed-in pages load. Imported straight into the server page, it would join /ai's entry chunks.
const AIChatApp = dynamic(() => import("./ai-chat-app"))

export default AIChatApp
