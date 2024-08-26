import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RH | Blog",
  description: "Built by @rizkyhaksono",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>);
}
