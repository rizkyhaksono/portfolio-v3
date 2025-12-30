import { isHaveValidToken } from "@/app/actions/actions"
import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern"
import ScrollProgress from "@/components/ui/scroll-progress"

export default async function BaseLayout({
  children,
  sidebar,
  rightSidebar,
  useGridBackground = true,
  useInteractiveGrid = false,
}: Readonly<{
  children: React.ReactNode
  sidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  useGridBackground?: boolean
  useInteractiveGrid?: boolean
}>) {
  const isHaveToken = await isHaveValidToken()

  return (
    <>
      <ScrollProgress />
      <div className="container min-h-screen pt-12 sm:pt-24 px-6">
        {useGridBackground && (
          <div className="fixed inset-0 flex items-center justify-center overflow-hidden h-40 pointer-events-none z-[-1]">
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]">
              <FlickeringGrid className="absolute inset-0 z-0 size-full w-full" squareSize={4} gridGap={6} color="#6B7280" maxOpacity={0.5} flickerChance={0.1} height={800} width={2000} />
            </div>
          </div>
        )}
        {useInteractiveGrid && (
          <div className="fixed inset-0 flex items-center justify-center overflow-hidden w-full h-40 pointer-events-none z-[-1]">
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]">
              <InteractiveGridPattern width={80} />
            </div>
          </div>
        )}
        <div className="block md:hidden">
          <Navbar isHaveToken={isHaveToken} />
        </div>
        <div className="flex md:gap-6">
          {sidebar && <aside>{sidebar}</aside>}
          <main className="mb-16 pt-4 w-full overflow-hidden">{children}</main>
          {rightSidebar && <aside className="hidden md:block w-64">{rightSidebar}</aside>}
        </div>
        <Footer />
      </div>
    </>
  )
}
