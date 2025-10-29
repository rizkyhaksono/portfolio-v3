import { getAllCarrer } from "@/services/visitor/career";
import TimelineSection from "@/app/_components/shared/timeline-section";

export default async function CarrerSection() {
  const careers = await getAllCarrer();

  return <TimelineSection title="Work Experience" items={careers} />;
}