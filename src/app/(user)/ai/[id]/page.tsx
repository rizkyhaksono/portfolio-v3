import BlurFade from "@/components/magicui/blur-fade";

type AIChatProps = {
  params: Promise<{ id: string }>;
};

const AIChatID = async (props: AIChatProps) => {
  return (
    <BlurFade>
      <h1>AI Chat ID</h1>
    </BlurFade>
  )
}

export default AIChatID;