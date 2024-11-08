"use server"

import { cookies } from "next/headers"

export async function getCookieValue(key: string) {
  const cookiesStore = await cookies()
  return cookiesStore.get(key)
}

export async function setCookieValue(key: string, value: string) {
  const cookiesStore = await cookies()
  cookiesStore.set(key, value)
}

export async function removeCookieValue(key: string) {
  const cookiesStore = await cookies()
  cookiesStore.delete(key)
}