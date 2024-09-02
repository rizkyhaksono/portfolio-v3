import IntroSection from "@/modules/intro";
import AboutSection from "@/modules/about";
import SkillSection from "@/modules/skills";
import CarrerSection from "@/modules/career";
import EducationSection from "@/modules/education";
import ContributionSection from "@/modules/contribution";
import ContactSection from "@/modules/contact";

export default async function Home() {
  return (
    <div className="container max-w-4xl min-h-screen pt-12 sm:pt-24 px-6">
      <IntroSection />
      <AboutSection />
      <SkillSection />
      <CarrerSection />
      <EducationSection />
      <ContributionSection />
      <ContactSection />
    </div>
  );
}
