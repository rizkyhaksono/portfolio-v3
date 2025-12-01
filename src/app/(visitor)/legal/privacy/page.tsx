import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <Typography.H1>Privacy Policy</Typography.H1>
            <Typography.P className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </Typography.P>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <Typography.H3>1. Introduction</Typography.H3>
              <Typography.P>
                Welcome to my portfolio website. This Privacy Policy explains how I collect, use, disclose, and safeguard your information when you visit my website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>2. Information I Collect</Typography.H3>
              <Typography.P>
                I may collect information about you in a variety of ways. The information I may collect on the website includes:
              </Typography.P>

              <div className="ml-4 space-y-4">
                <div>
                  <Typography.H4 className="text-base font-semibold mb-2">Personal Data</Typography.H4>
                  <Typography.P>
                    Personally identifiable information, such as your name, email address, and other contact information that you voluntarily give to me when you register with the website, when you contact me through the contact form, or when you participate in activities on the website.
                  </Typography.P>
                </div>

                <div>
                  <Typography.H4 className="text-base font-semibold mb-2">Derivative Data</Typography.H4>
                  <Typography.P>
                    Information our servers automatically collect when you access the website, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the website.
                  </Typography.P>
                </div>

                <div>
                  <Typography.H4 className="text-base font-semibold mb-2">Third-Party Data</Typography.H4>
                  <Typography.P>
                    Information from third parties, such as social media platforms (GitHub, LinkedIn) if you choose to authenticate using OAuth providers.
                  </Typography.P>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <Typography.H3>3. Use of Your Information</Typography.H3>
              <Typography.P>
                Having accurate information about you permits me to provide you with a smooth, efficient, and customized experience. Specifically, I may use information collected about you via the website to:
              </Typography.P>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create and manage your account</li>
                <li>Process your authentication and login</li>
                <li>Respond to your comments, questions, and provide customer service</li>
                <li>Monitor and analyze usage and trends to improve your experience with the website</li>
                <li>Prevent fraudulent transactions and monitor against theft</li>
              </ul>
            </section>

            <section className="space-y-3">
              <Typography.H3>4. Disclosure of Your Information</Typography.H3>
              <Typography.P>
                I may share information I have collected about you in certain situations. Your information may be disclosed as follows:
              </Typography.P>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>By Law or to Protect Rights:</strong> If I believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of my policies, or to protect the rights, property, and safety of others.</li>
                <li><strong>Third-Party Service Providers:</strong> I may share your information with third parties that perform services for me or on my behalf, such as authentication providers.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <Typography.H3>5. Security of Your Information</Typography.H3>
              <Typography.P>
                I use administrative, technical, and physical security measures to help protect your personal information. While I have taken reasonable steps to secure the personal information you provide to me, please be aware that despite my efforts, no security measures are perfect or impenetrable.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>6. Cookies and Tracking Technologies</Typography.H3>
              <Typography.P>
                I may use cookies, web beacons, tracking pixels, and other tracking technologies on the website to help customize the website and improve your experience. For more information on how I use cookies, please refer to the cookie settings in your browser.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>7. Third-Party Websites</Typography.H3>
              <Typography.P>
                The website may contain links to third-party websites and applications of interest. Once you have used these links to leave the website, any information you provide to these third parties is not covered by this Privacy Policy, and I cannot guarantee the safety and privacy of your information.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>8. Your Rights</Typography.H3>
              <Typography.P>
                You have the right to:
              </Typography.P>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access the personal information I hold about you</li>
                <li>Request correction of your personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Request transfer of your personal information</li>
              </ul>
            </section>

            <section className="space-y-3">
              <Typography.H3>9. Changes to This Privacy Policy</Typography.H3>
              <Typography.P>
                I may update this Privacy Policy from time to time in order to reflect changes to my practices or for other operational, legal, or regulatory reasons. I will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </Typography.P>
            </section>

            <section className="space-y-3">
              <Typography.H3>10. Contact Me</Typography.H3>
              <Typography.P>
                If you have questions or comments about this Privacy Policy, please contact me via the contact form on this website or through my{" "}
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
