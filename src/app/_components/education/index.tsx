import { getAllEducation } from "@/services/visitor/education";
import TimelineSection from "@/app/_components/shared/timeline-section";

export default async function EducationSection() {
  const educations = await getAllEducation();

  return <TimelineSection title="Education" items={educations} />;
}