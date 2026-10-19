import type { Metadata } from "next"
import { LegalDocument } from "@/components/ui/legal-document"
import { InkLink } from "@/components/ui/ink-link"
import { getMetadataBaseUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Terms of service | Rizky Haksono",
  description: "The rules for using natee.my.id, its public chat, tracker, Etan AI and roadmap certificates.",
  metadataBase: getMetadataBaseUrl(),
  alternates: { canonical: "/legal/terms" },
}

const sections = [
  {
    id: "acceptance",
    title: "Using this site",
    body: <p>By using natee.my.id you agree to these terms. If you do not agree, please do not use the site.</p>,
  },
  {
    id: "license",
    title: "What you may do with the content",
    body: (
      <>
        <p>
          You may read, share links to and quote the writing, projects and roadmaps here for personal, non-commercial use.
          That is a licence to view, not a transfer of ownership, so you may not:
        </p>
        <ul>
          <li>change or republish the material as your own;</li>
          <li>use it for commercial purposes without asking;</li>
          <li>try to decompile or reverse engineer software on the site;</li>
          <li>remove copyright or other notices from it.</li>
        </ul>
        <p>Open-source projects linked from the site are covered by their own licences.</p>
      </>
    ),
  },
  {
    id: "posts",
    title: "What you post",
    body: (
      <p>
        Messages in the public chat, cards on the tracker and feedback notes are yours, and anyone can read the first two.
        Keep them civil and lawful. I may edit or remove anything abusive, misleading or off topic, and close accounts that
        keep posting it.
      </p>
    ),
  },
  {
    id: "etan-ai",
    title: "Etan AI answers",
    body: (
      <p>
        Etan AI and the other AI tools write their answers with Google Gemini. The answers can be wrong or out of date, and
        they are not professional advice. Check anything that matters before you rely on it.
      </p>
    ),
  },
  {
    id: "certificates",
    title: "Roadmap certificates",
    body: (
      <p>
        A roadmap certificate is self-attested: it records that you marked every lesson of a roadmap complete. Nobody
        examined or checked the work, and it is not an accredited qualification.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "No warranty",
    body: (
      <p>
        The site and everything on it are provided as they are. I make no promises, express or implied, that they are
        accurate, complete, fit for a particular purpose or free of errors, and the material may change at any time without
        notice.
      </p>
    ),
  },
  {
    id: "limitations",
    title: "Limits of liability",
    body: (
      <p>
        I am not liable for any loss, including lost data or profit, that comes from using the site or from not being able
        to use it.
      </p>
    ),
  },
  {
    id: "links",
    title: "Links to other sites",
    body: (
      <p>
        I have not reviewed every site this one links to and am not responsible for what they publish. A link is not an
        endorsement; you follow it at your own risk.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: <p>I may revise these terms. The version on this page, with the date at the top, is the one that applies.</p>,
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

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      title="Terms of service"
      standfirst="The few rules for reading, posting and learning here."
      dateline="Last updated 19 October 2026."
      prev={{ href: "/legal/privacy", title: "Privacy policy" }}
      sections={sections}
    />
  )
}
