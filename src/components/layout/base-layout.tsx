import { isHaveValidToken } from "@/app/actions/actions"
import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import ScrollProgress from "@/components/ui/scroll-progress"

export default async function BaseLayout({
  children,
  sidebar,
  rightSidebar,
  hideFooter = false,
}: Readonly<{
  children: React.ReactNode
  sidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  hideFooter?: boolean
}>) {
  const isHaveToken = await isHaveValidToken()

  return (
    <>
      <ScrollProgress />
      {/* Padding comes from Tailwind `container` (2rem) — do not add extra px-* here. */}
      <div className="container min-h-screen pt-6 sm:pt-10">
        <div className="block md:hidden">
          <Navbar isHaveToken={isHaveToken} />
        </div>
        <div className="flex min-w-0 md:gap-4">
          {sidebar && <aside>{sidebar}</aside>}
          <main className="mb-10 min-w-0 w-full overflow-x-clip pt-2">{children}</main>
          {rightSidebar && <aside className="hidden md:block">{rightSidebar}</aside>}
        </div>
        {hideFooter ? null : <Footer />}
      </div>
    </>
  )
}
