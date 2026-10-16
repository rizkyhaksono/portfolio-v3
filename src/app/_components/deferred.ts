/**
 * Off-screen sections skip rendering until near the viewport (Activity, Credentials, Readers,
 * Recommendations only; never on or around sticky). The 8px gutter keeps focus outlines out of the paint clip.
 */
export const DEFERRED_SECTION = "-mx-2 px-2 [content-visibility:auto] [contain-intrinsic-size:auto_36rem]"
