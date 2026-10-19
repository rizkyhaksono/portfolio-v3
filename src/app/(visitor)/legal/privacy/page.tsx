import type { Metadata } from "next"
import { LegalDocument } from "@/components/ui/legal-document"
import { InkLink } from "@/components/ui/ink-link"
import { getMetadataBaseUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Privacy policy | Rizky Haksono",
  description: "What natee.my.id collects, why, who else handles it, and how to have it removed.",
  metadataBase: getMetadataBaseUrl(),
  alternates: { canonical: "/legal/privacy" },
}

const sections = [
  {
    id: "who",
    title: "Who looks after your data",
    body: (
      <p>
        This is the personal site of Rizky Haksono at natee.my.id. I build and run it myself, so &ldquo;I&rdquo; in this
        policy means me. Nothing here is sold, and nothing is shared for advertising.
      </p>
    ),
  },
  {
    id: "what-you-give",
    title: "What you give me",
    body: (
      <>
        <p>Only what you choose to send:</p>
        <ul>
          <li>Your account: the name, email address and picture from the email sign-up or from Google when you sign in with it.</li>
          <li>Your profile, if you fill it in: headline, location, a few lines about you and a banner image.</li>
          <li>
            The contact form: your email address, name and message. EmailJS delivers the message to my inbox, and Cloudflare
            Turnstile checks that a person sent it.
          </li>
          <li>
            The public chat and the tracker board: what you post there is public, shown with your name and picture, until you
            or I delete it.
          </li>
          <li>The feedback note: your message and the path of the page you sent it from.</li>
        </ul>
      </>
    ),
  },
  {
    id: "visitor-counts",
    title: "Visitor counts",
    body: (
      <>
        <p>
          I count visits with Umami, which I host myself at umami.natee.my.id. Umami sets no cookies and keeps no identifier
          that follows you to other sites. It records the page path, the referring site, your browser, operating system,
          device type, screen size, language and country, and how quickly the page loaded. Query strings are stripped before anything is sent,
          except campaign tags such as <code>utm_source</code>.
        </p>
        <p>
          Public pages only ever show totals, such as how many people read a post. To leave yourself out of the counts, run{" "}
          <code>localStorage.setItem(&quot;umami.disabled&quot;, &quot;1&quot;)</code> in your browser&rsquo;s console on
          this site.
        </p>
      </>
    ),
  },
  {
    id: "recordings",
    title: "Session recordings",
    body: (
      <p>
        On about 15 in every 100 visits, Umami also records how the page is used, such as clicks, scrolling and moves between
        pages, so I can see where the layout gets in the way. It starts only once the page is idle, and never on the sign-in,
        account, admin or Etan AI pages, or while you are signed in. The recordings stay on the same Umami server.
      </p>
    ),
  },
  {
    id: "etan-ai",
    title: "Etan AI and Google Gemini",
    body: (
      <p>
        Etan AI, the document reader and the job description matcher send what you type or upload to Google&rsquo;s Gemini
        API, which writes the answer; Google handles that data under its Gemini API terms. Chats you have while signed in are
        saved with your account so you can come back to them. Please do not paste passwords, keys or anyone else&rsquo;s
        personal details.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and browser storage",
    body: (
      <>
        <p>
          The site sets one cookie of its own, <code>NATEE_V3_TOKEN</code>, when you sign in, to keep you signed in. There
          are no advertising or tracking cookies. Cloudflare Turnstile and Google sign-in may set their own while you use
          them.
        </p>
        <p>
          Your browser&rsquo;s local storage keeps a few settings that never leave your device: the light or dark theme,
          your roadmap progress and the name for its certificate, and when you last used the contact form. Embedded YouTube
          videos load from YouTube only after you press play.
        </p>
      </>
    ),
  },
  {
    id: "others",
    title: "Who else handles it",
    body: (
      <p>
        Google (sign-in and Gemini), Cloudflare (Turnstile), EmailJS (contact messages) and the company that hosts my
        server process data for these features only. I may also disclose information when the law requires it, or to stop
        abuse of the site.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        The site is served over HTTPS and the admin pages are closed to everyone but me. No system is perfectly secure,
        so please use a password you do not use anywhere else.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <p>
        You can ask to see the data I hold about you, to correct it, to delete it, or to have a copy sent to you. You can
        also object to how I use it. Write to me with the address you signed in with.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: <p>When this policy changes, the date at the top of the page changes with it.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions go through the <InkLink href="/#contact">contact form on the home page</InkLink>, or to{" "}
        <InkLink href="mailto:mrizkyhaksono@gmail.com">mrizkyhaksono@gmail.com</InkLink>.
      </p>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy policy"
      standfirst="What this site collects, why it collects it, and how to have it removed."
      dateline="Last updated 19 October 2026."
      next={{ href: "/legal/terms", title: "Terms of service" }}
      sections={sections}
    />
  )
}
