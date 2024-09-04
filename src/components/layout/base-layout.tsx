import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container max-w-4xl min-h-screen pt-12 sm:pt-24 px-6">
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden h-40 pointer-events-none z-[-1]">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]"
          )}
        />
      </div>
      <Navbar />
      {children}
      <Footer />
    </div>

  )
}