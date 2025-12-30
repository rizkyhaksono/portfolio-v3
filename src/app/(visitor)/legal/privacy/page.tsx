import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Eye, Database, Lock, Cookie, ExternalLink, UserCheck, RefreshCw, Mail, ArrowLeft, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import BlurFade from "@/components/magicui/blur-fade"

const sections = [
  {
    id: "introduction",
    icon: FileText,
    title: "1. Introduction",
    content:
      "Welcome to my portfolio website. This Privacy Policy explains how I collect, use, disclose, and safeguard your information when you visit my website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.",
  },
  {
    id: "data-collection",
    icon: Database,
    title: "2. Information I Collect",
    content: "I may collect information about you in a variety of ways. The information I may collect on the website includes:",
    subsections: [
      {
        title: "Personal Data",
        content:
          "Personally identifiable information, such as your name, email address, and other contact information that you voluntarily give to me when you register with the website, when you contact me through the contact form, or when you participate in activities on the website.",
      },
      {
        title: "Derivative Data",
        content:
          "Information our servers automatically collect when you access the website, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the website.",
      },
      {
        title: "Third-Party Data",
        content: "Information from third parties, such as social media platforms (GitHub, LinkedIn) if you choose to authenticate using OAuth providers.",
      },
    ],
  },
  {
    id: "data-usage",
    icon: Eye,
    title: "3. Use of Your Information",
    content: "Having accurate information about you permits me to provide you with a smooth, efficient, and customized experience. Specifically, I may use information collected about you via the website to:",
    list: [
      "Create and manage your account",
      "Process your authentication and login",
      "Respond to your comments, questions, and provide customer service",
      "Monitor and analyze usage and trends to improve your experience with the website",
      "Prevent fraudulent transactions and monitor against theft",
    ],
  },
  {
    id: "disclosure",
    icon: ExternalLink,
    title: "4. Disclosure of Your Information",
    content: "I may share information I have collected about you in certain situations. Your information may be disclosed as follows:",
    list: [
      "By Law or to Protect Rights: If I believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of my policies, or to protect the rights, property, and safety of others.",
      "Third-Party Service Providers: I may share your information with third parties that perform services for me or on my behalf, such as authentication providers.",
    ],
  },
  {
    id: "security",
    icon: Lock,
    title: "5. Security of Your Information",
    content:
      "I use administrative, technical, and physical security measures to help protect your personal information. While I have taken reasonable steps to secure the personal information you provide to me, please be aware that despite my efforts, no security measures are perfect or impenetrable.",
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "6. Cookies and Tracking Technologies",
    content:
      "I may use cookies, web beacons, tracking pixels, and other tracking technologies on the website to help customize the website and improve your experience. For more information on how I use cookies, please refer to the cookie settings in your browser.",
  },
  {
    id: "third-party",
    icon: ExternalLink,
    title: "7. Third-Party Websites",
    content:
      "The website may contain links to third-party websites and applications of interest. Once you have used these links to leave the website, any information you provide to these third parties is not covered by this Privacy Policy, and I cannot guarantee the safety and privacy of your information.",
  },
  {
    id: "rights",
    icon: UserCheck,
    title: "8. Your Rights",
    content: "You have the right to:",
    list: [
      "Access the personal information I hold about you",
      "Request correction of your personal information",
      "Request deletion of your personal information",
      "Object to processing of your personal information",
      "Request transfer of your personal information",
    ],
  },
  {
    id: "changes",
    icon: RefreshCw,
    title: "9. Changes to This Privacy Policy",
    content:
      'I may update this Privacy Policy from time to time in order to reflect changes to my practices or for other operational, legal, or regulatory reasons. I will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.',
  },
  {
    id: "contact",
    icon: Mail,
    title: "10. Contact Me",
    content: "If you have questions or comments about this Privacy Policy, please contact me via the contact form on this website or through my GitHub profile.",
    hasContact: true,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="container max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Shield className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground mt-1">How I collect, use, and protect your information</p>
              <Badge variant="secondary" className="mt-3">
                Last updated: December 28, 2025
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3">Quick Navigation</p>
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                  {section.title.replace(/^\d+\.\s/, "")}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={section.id} id={section.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h2 className="text-xl font-semibold">{section.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{section.content}</p>

                      {section.subsections && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-muted">
                          {section.subsections.map((sub, i) => (
                            <div key={i}>
                              <h3 className="font-medium mb-1">{sub.title}</h3>
                              <p className="text-sm text-muted-foreground">{sub.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.list && (
                        <ul className="mt-3 space-y-2">
                          {section.list.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.hasContact && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Link href="/#contact">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Mail className="w-4 h-4" />
                              Contact Form
                            </Button>
                          </Link>
                          <Link href="https://github.com/rizkyhaksono" target="_blank">
                            <Button variant="outline" size="sm" className="gap-2">
                              <ExternalLink className="w-4 h-4" />
                              GitHub Profile
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Rizky Haksono. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/legal/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </BlurFade>
  )
}
