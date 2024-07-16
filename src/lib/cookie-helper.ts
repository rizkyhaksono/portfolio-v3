"use server"

import { cookies } from "next/headers"

export async function getCookieValue(key: string) {
  const cookiesStore = cookies()
  return cookiesStore.get(key)
}

export async function setCookieValue(key: string, value: string) {
  const cookiesStore = cookies()
  cookiesStore.set(key, value)
}

export async function removeCookieValue(key: string) {
  const cookiesStore = cookies()
  cookiesStore.delete(key)
}
