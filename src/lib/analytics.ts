type EventData = Record<string, string | number | boolean>

// Plan §5.3: kebab-case, ≤50 chars, enum-like data values, never PII.
export type EventName =
  | 'nav-click'
  | 'menu-open'
  | 'theme-toggle'
  | 'outbound-click'
  | 'cta-click'
  | 'resume-open'
  | 'portfolio-open'
  | 'social-click'
  | 'email-click'
  | 'cert-verify'
  | 'contact-send'
  | 'ai-error'
  | 'not-found'
  | 'blog-open'
  | 'rss-subscribe'
  | 'Click Copy Code'
  | 'clap'
  | 'project-site'
  | 'project-source'
  | 'roadmap-lesson-complete'
  | 'video-play'
  | 'tool-open'
  | 'chat-send'
  | 'tracker-card-move'
  | 'stats-profile-open'
  | 'ai-tab'
  | 'ai-chat-send'
  | 'ai-ocr-run'
  | 'ai-jd-run'
  | 'hirefit-share'
  | 'signin-start'
  | 'signin-complete'
  | 'signup-complete'
  | 'profile-save'

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void }
  }
}

export const track = (name: EventName, data?: EventData) => window.umami?.track(name, data)

/**
 * Forwards clicks on `[data-track]` elements to `track()`: `data-track="nav-click" data-track-item="blog"`
 * sends `nav-click { item: "blog" }`. Used for internal links, where `data-umami-event` would
 * preventDefault and force a full page load. Never cancels the click. Returns the cleanup.
 */
export function installTrackDelegation(): () => void {
  const onClick = (event: MouseEvent) => {
    const el = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-track]') : null
    const name = el?.dataset.track
    if (!el || !name) return

    const data: EventData = {}
    for (const [key, value] of Object.entries(el.dataset)) {
      if (key.length > 5 && key.startsWith('track') && value) data[key[5].toLowerCase() + key.slice(6)] = value
    }
    track(name as EventName, Object.keys(data).length ? data : undefined)
  }

  document.addEventListener('click', onClick, true)
  return () => document.removeEventListener('click', onClick, true)
}
