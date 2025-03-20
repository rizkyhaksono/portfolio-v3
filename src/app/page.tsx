import IntroSection from "@/app/_components/intro";
import AboutSection from "@/app/_components/about";
import SkillSection from "@/app/_components/skills";
import CarrerSection from "@/app/_components/career";
import EducationSection from "@/app/_components/education";
import ContributionSection from "@/app/_components/contribution";
import ContactSection from "@/app/_components/contact";
import BaseLayout from "@/components/layout/base-layout";
import SidebarMain from "@/components/layout/sidebar-main";

export default async function Home() {
  return (
    <BaseLayout sidebar={<SidebarMain />}>
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
