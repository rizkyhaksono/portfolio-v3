import BaseLayout from "@/components/layout/base-layout"
import GreetingSection from "@/components/layout/greeting-section"
import AboutSection from "@/components/layout/about-section"
import CareerSection from "@/components/layout/career-section"
import PortfolioSection from "@/components/layout/portfolio-section"

export default async function Home() {
  return (
    <BaseLayout>
      <GreetingSection />
      <AboutSection />
      <CareerSection />
      <PortfolioSection />
    </BaseLayout>
  )
}
