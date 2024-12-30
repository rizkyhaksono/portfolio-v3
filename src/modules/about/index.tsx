import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

export default function AboutSection() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">About</p>
        <div className="font-sans text-sm text-muted-foreground dark:prose-invert">
          Experience in Software Development with skills in Web and Mobile Development. I am still an undergraduate and have experience related to web and mobile development as well as UI/UX design.
<<<<<<< HEAD
          <div className="flex gap-4 mt-4">
            <Link href="https://drive.google.com/file/d/1OXy50uSiyhbMBRzVyBstMW7-kAwQ37VZ/view?usp=sharing" target="_blank">
              <Button className="flex gap-1" variant={"outline"} size={"sm"}>
=======
          <div className="flex gap-4 w-full mt-4">
            <Link href="https://drive.google.com/file/d/1OXy50uSiyhbMBRzVyBstMW7-kAwQ37VZ/view?usp=sharing" target="_blank">
              <Button variant={"outline"} size={"sm"}>
>>>>>>> a49bb309d0eff8491f2f904c24c53c3762f951d9
                View CV <ExternalLink size={16} />
              </Button>
            </Link>
            <Link href="https://drive.google.com/file/d/1xb9nKFHr05NksJC5AAB0gl1fNco2apyP/view?usp=sharing" target="_blank">
<<<<<<< HEAD
              <Button className="flex gap-1" variant={"outline"} size={"sm"}>
=======
              <Button variant={"outline"} size={"sm"}>
>>>>>>> a49bb309d0eff8491f2f904c24c53c3762f951d9
                View Portfolio in PDF <FileText size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </BlurFade>
  )
}