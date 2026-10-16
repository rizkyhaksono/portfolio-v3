type EventData = Record<string, string | number | boolean>

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void }
  }
}

export const track = (name: string, data?: EventData) => window.umami?.track(name, data)
