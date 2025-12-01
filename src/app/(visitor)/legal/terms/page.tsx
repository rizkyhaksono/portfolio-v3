import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl py-12">
      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <Typography.H1>Terms of Service</Typography.H1>
            <Typography.P className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </Typography.P>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <Typography.H3>1. Acceptance of Terms</Typography.H3>
              <Typography.P>
                By accessing and using this portfolio website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this website.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>2. Use License</Typography.H3>
              <Typography.P>
                Permission is granted to temporarily view the materials (information or software) on this website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </Typography.P>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software on this website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="space-y-3">
              <Typography.H3>3. Disclaimer</Typography.H3>
              <Typography.P>
                The materials on this website are provided on an 'as is' basis. I make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>4. Limitations</Typography.H3>
              <Typography.P>
                In no event shall Rizky Haksono or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>5. Accuracy of Materials</Typography.H3>
              <Typography.P>
                The materials appearing on this website could include technical, typographical, or photographic errors. I do not warrant that any of the materials on this website are accurate, complete, or current. I may make changes to the materials contained on this website at any time without notice.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>6. Links</Typography.H3>
              <Typography.P>
                I have not reviewed all of the sites linked to this website and am not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by me of the site. Use of any such linked website is at the user's own risk.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>7. Modifications</Typography.H3>
              <Typography.P>
                I may revise these terms of service for this website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>8. Contact</Typography.H3>
              <Typography.P>
                If you have any questions about these Terms of Service, please contact me via the contact form on this website or through my{" "}
                <Link href="https://github.com/rizkyhaksono" className="text-primary hover:underline" target="_blank">
                  GitHub profile
                </Link>.
              </Typography.P>
            </section>
          </div>

          <div className="pt-6 border-t">
            <Link href="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
