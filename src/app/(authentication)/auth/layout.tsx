import { type Metadata } from "next"

// Other fields (base URL, Open Graph, authors) come from the root layout.
export const metadata: Metadata = {
  title: "Sign in | Rizky Haksono",
  description: "Sign in or create an account to keep your Etan AI chats and take part in the public chat.",
  robots: { index: false, follow: true },
}

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
