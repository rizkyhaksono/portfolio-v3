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
import RightSidebarMain from "@/components/layout/right-sidebar-main"
import { getLinkedinRecommendations } from "@/services/visitor/linkedin"

export default async function Home() {
  const linkedinRecommendationsResponse = await getLinkedinRecommendations()
  const recommendations = linkedinRecommendationsResponse?.data || []

  return (
    <BaseLayout sidebar={<SidebarMain />} rightSidebar={<RightSidebarMain />}>
      <IntroSection />
      <AboutSection />
      <SkillSection />
      <CarrerSection />
      <EducationSection />
      <CertificationSection />
      <ContributionSection />
      <SiteStatsSection />
      <LinkedinRecommendations recommendations={recommendations} />
      <ContactSection />
    </BaseLayout>
  )
}
