import { type Metadata } from "next"
import BaseLayout from "@/components/layout/base-layout";

// Other fields (base URL, Open Graph, authors) come from the root layout.
export const metadata: Metadata = {
  title: "Profile | Rizky Haksono",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <BaseLayout>
      <div data-private>{children}</div>
    </BaseLayout>
  )
}
