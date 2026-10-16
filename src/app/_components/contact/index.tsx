import { Fragment } from "react"
import { PageSection } from "@/components/ui/page-section"
import { InkLink } from "@/components/ui/ink-link"
import { media_socials } from "@/commons/constants/contact"
import { ContactForm } from "./contact-form"

const EMAIL = "mrizkyhaksono@gmail.com"

export default function ContactSection() {
  const socials = media_socials.map(({ title, href }, i, all) => (
    <Fragment key={title}>
      {i > 0 && (i === all.length - 1 ? " and " : ", ")}
      <InkLink href={href} external event="social-click" eventData={{ network: title.toLowerCase(), area: "contact" }}>
        {title}
      </InkLink>
    </Fragment>
  ))

  return (
    <PageSection
      id="contact"
      heading={{ title: "Contact" }}
      contentClassName="mt-6 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16"
    >
      <div className="space-y-4 text-body text-ink">
        <p>
          Write to{" "}
          <InkLink href={`mailto:${EMAIL}`} event="email-click" eventData={{ area: "contact" }} className="break-all">
            {EMAIL}
          </InkLink>
          , or use the form.
        </p>
        <p>
          I am also on {socials}.
        </p>
      </div>
      <ContactForm />
    </PageSection>
  )
}
