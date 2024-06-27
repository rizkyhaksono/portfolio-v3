import BaseLayout from "@/components/layout/base-layout";
import GreetingSection from "@/components/layout/greeting-section";
import AboutSection from "@/components/layout/about-section";
import SkillsSection from "@/components/layout/skills-section";
import CareerSection from "@/components/layout/career-section";
import ProjectSection from "@/components/layout/project-section";

export default async function Home() {
  return (
    <BaseLayout>
      <GreetingSection />
      <AboutSection />
      <SkillsSection />
      <CareerSection />
      <ProjectSection />
    </BaseLayout>
  );
}
