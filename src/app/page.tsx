import IntroSection from "@/modules/intro";
import AboutSection from "@/modules/about";
import SkillSection from "@/modules/skills";
import CarrerSection from "@/modules/career";
import EducationSection from "@/modules/education";
import ContributionSection from "@/modules/contribution";
import ContactSection from "@/modules/contact";
import BaseLayout from "@/components/layout/base-layout";

export default async function Home() {
  return (
    <BaseLayout>
      <IntroSection />
      <AboutSection />
      <SkillSection />
      <CarrerSection />
      <EducationSection />
      <ContributionSection />
      <ContactSection />
    </BaseLayout>
  );
}
