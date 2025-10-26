import BlurFade from "@/components/magicui/blur-fade";
import WPMTest from "./wpm/wpm-test";

export function WpmTab() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center mb-6">
        <p className="text-center text-xl font-semibold">WPM</p>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>This is a simple WPM (Words Per Minute) test application.</p>
          <p>You can type the text below and see how many words you can type in one minute.</p>
        </div>
      </div>
      <WPMTest />
    </BlurFade>
  );
}
