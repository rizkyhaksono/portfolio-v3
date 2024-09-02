import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RH | Project",
  description: "Built by @rizkyhaksono",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container max-w-4xl min-h-screen pt-12 sm:pt-24 px-6">
      {children}
    </div>);
}