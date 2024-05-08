import Header from "./header"
import Footer from "./footer"

export default function BaseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="container max-w-screen-2xl mx-auto">
      <Header />
      {children}
      <Footer />
    </main>
  )
}
