"use client"

import type { ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SourceTab {
  id: string
  label: string
  content: ReactNode
}

/** Tabs kept in `?tab=` so a reload or a shared link opens the same table. Inactive tabs do not mount. */
export function SourceTabs({ tabs }: Readonly<{ tabs: SourceTab[] }>) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const asked = params.get("tab")
  const value = tabs.some((tab) => tab.id === asked) ? (asked as string) : tabs[0].id

  return (
    <Tabs value={value} onValueChange={(next) => router.replace(`${pathname}?tab=${next}`, { scroll: false })}>
      <TabsList className="mx-auto w-full max-w-[60rem]">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-8">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
