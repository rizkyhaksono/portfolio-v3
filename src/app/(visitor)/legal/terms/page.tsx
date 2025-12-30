import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { FileText, Scale, AlertTriangle, ShieldAlert, FileCheck, Link2, RefreshCw, Mail, ArrowLeft, ExternalLink, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import BlurFade from "@/components/magicui/blur-fade"

const sections = [
  {
    id: "acceptance",
    icon: CheckCircle,
    title: "1. Acceptance of Terms",
    content: "By accessing and using this portfolio website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this website.",
  },
  {
    id: "license",
    icon: FileText,
    title: "2. Use License",
    content:
      "Permission is granted to temporarily view the materials (information or software) on this website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
    list: ["Modify or copy the materials", "Use the materials for any commercial purpose", "Attempt to decompile or reverse engineer any software on this website", "Remove any copyright or other proprietary notations from the materials"],
  },
  {
    id: "disclaimer",
    icon: AlertTriangle,
    title: "3. Disclaimer",
    content:
      "The materials on this website are provided on an 'as is' basis. I make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
    variant: "warning",
  },
  {
    id: "limitations",
    icon: ShieldAlert,
    title: "4. Limitations",
    content:
      "In no event shall Rizky Haksono or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.",
  },
  {
    id: "accuracy",
    icon: FileCheck,
    title: "5. Accuracy of Materials",
    content:
      "The materials appearing on this website could include technical, typographical, or photographic errors. I do not warrant that any of the materials on this website are accurate, complete, or current. I may make changes to the materials contained on this website at any time without notice.",
  },
  {
    id: "links",
    icon: Link2,
    title: "6. Links",
    content:
      "I have not reviewed all of the sites linked to this website and am not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by me of the site. Use of any such linked website is at the user's own risk.",
  },
  {
    id: "modifications",
    icon: RefreshCw,
    title: "7. Modifications",
    content: "I may revise these terms of service for this website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.",
  },
  {
    id: "contact",
    icon: Mail,
    title: "8. Contact",
    content: "If you have any questions about these Terms of Service, please contact me via the contact form on this website or through my GitHub profile.",
    hasContact: true,
  },
]

export default function TermsOfServicePage() {
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
              <Scale className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground mt-1">Rules and guidelines for using this website</p>
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
            const isWarning = section.variant === "warning"

            return (
              <Card key={section.id} id={section.id} className={isWarning ? "border-yellow-200 dark:border-yellow-800" : ""}>
                <CardContent className={`p-6 ${isWarning ? "bg-yellow-50/50 dark:bg-yellow-950/20" : ""}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${isWarning ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-muted"}`}>
                      <Icon className={`w-5 h-5 ${isWarning ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h2 className="text-xl font-semibold">{section.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{section.content}</p>

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
            <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
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
