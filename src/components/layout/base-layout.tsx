import Header from "./header"
import Footer from "./footer"

export default function BaseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="container max-w-screen-xl mx-auto max-[644px]:text-xs sm:text-xs md:text-sm lg:text-base text-base">
      <Header />
      {children}
      <Footer />
    </main>
  )
}
