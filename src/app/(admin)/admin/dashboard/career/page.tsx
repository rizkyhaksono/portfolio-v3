"use client"

import { Collection } from "../_components/collection"
import { supabaseCareer } from "../_components/sources"

export default function AdminCareerPage() {
  return <Collection {...supabaseCareer} />
}
