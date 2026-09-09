import { Suspense } from "react"
import IntroSection from "@/app/_components/intro"
import AboutSection from "@/app/_components/about"
import SkillSection from "@/app/_components/skills"
import CarrerSection from "@/app/_components/career"
import EducationSection from "@/app/_components/education"
import CertificationSection from "@/app/_components/certification"
import ContributionSection from "@/app/_components/contribution"
import ContactSection from "@/app/_components/contact"
import LinkedinRecommendations from "@/app/_components/contact/linkedin-recommendations"
import SiteStatsSection from "@/app/_components/site-stats"
import BaseLayout from "@/components/layout/base-layout"
import SidebarMain from "@/components/layout/sidebar-main"
import { getLinkedinRecommendations } from "@/services/visitor/linkedin"

export const dynamic = "force-dynamic"

/** Loads recommendations independently so they never block the page shell. */
async function RecommendationsSection() {
  const linkedinRecommendationsResponse = await getLinkedinRecommendations()
  const recommendations = linkedinRecommendationsResponse?.data || []

  return <LinkedinRecommendations recommendations={recommendations} />
}

/** Keeps the streamed page rhythm stable while a remote section loads. */
function SectionFallback() {
  return <div className="my-10 h-px bg-border" aria-hidden="true" />
}

/** Renders the fast portfolio shell while remote sections stream independently. */
export default function Home() {
  return (
    <BaseLayout sidebar={<SidebarMain />}>
      <IntroSection />
      <AboutSection />
      <SkillSection />
      <Suspense fallback={<SectionFallback />}>
        <CarrerSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <EducationSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ContributionSection />
      </Suspense>

      <div className="mt-12 space-y-12">
        <Suspense fallback={<SectionFallback />}>
          <CertificationSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <SiteStatsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <RecommendationsSection />
        </Suspense>
        <ContactSection />
      </div>
    </BaseLayout>
  )
}
