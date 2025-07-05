import { isHaveValidToken } from "@/app/actions/actions";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import DotPattern from "@/components/magicui/dot-pattern";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import ScrollProgress from "@/components/ui/scroll-progress";
import { cn } from "@/lib/utils";

export default async function BaseLayout({
  children,
  sidebar,
  rightSidebar,
}: Readonly<{
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
}>) {
  const isHaveToken = await isHaveValidToken();

  return (
    <>
      <ScrollProgress />
      <div className="container min-h-screen pt-12 sm:pt-24 px-6">
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden h-40 pointer-events-none z-[-1]">
          <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:hidden">
            <InteractiveGridPattern
              className={cn(
                "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
              )}
            />
          </div>
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={1}
            className={cn(
              "[-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] hidden md:block",
            )}
          />
        </div>
        <div className="block md:hidden">
          <Navbar isHaveToken={isHaveToken} />
        </div>
        <div className="flex md:gap-6">
          {sidebar && <aside>{sidebar}</aside>}
          <main className="mb-16 pt-4 w-full overflow-hidden">
            {children}
          </main>
          {rightSidebar && <aside className="hidden md:block w-64">{rightSidebar}</aside>}
        </div>
        <Footer />
      </div>
    </>
  )
}