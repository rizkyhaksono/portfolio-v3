import BaseLayout from "@/components/layout/base-layout"

/** The shell sits in the layout, so the loading skeleton shows inside the sidebar and top bar too. */
export default function StatsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <BaseLayout>{children}</BaseLayout>
}
