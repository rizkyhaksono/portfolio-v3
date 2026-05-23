"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

const Grainient = dynamic(() => import("@/components/Grainient"), {
  ssr: false,
  loading: () => null,
})

export default function GrainientLazy(props: ComponentProps<typeof Grainient>) {
  return <Grainient {...props} />
}
