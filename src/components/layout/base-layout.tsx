import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/libs/utils";
import ScrollProgress from "@/components/ui/scroll-progress";

export default function BaseLayout({
  children,
  sidebar
}: Readonly<{
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}>) {
  return (
    <>
      <ScrollProgress />
      <div className="container min-h-screen pt-12 sm:pt-24 px-6">
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
        <div className="block md:hidden">
          <Navbar />
        </div>
        <div className="flex md:gap-6 max-w-7xl">
          {sidebar && <aside>{sidebar}</aside>}
          <main className=" mb-16 pt-4 w-full overflow-hidden xl:max-w-4xl">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </>
  )
}