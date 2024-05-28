import Header from "./header";
import Footer from "./footer";

export default function BaseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="container max-w-screen-xl mx-auto">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
