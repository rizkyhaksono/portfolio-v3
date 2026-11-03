import AIHub from "./_components/ai-hub"

export const dynamic = "force-dynamic"

interface AIPageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function AIPage({ searchParams }: Readonly<AIPageProps>) {
  const { tab } = await searchParams
  return <AIHub initialTab={tab} />
}
