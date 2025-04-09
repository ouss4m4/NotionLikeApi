// lib/api.ts
import { useUserStore } from '@/stores/user'

export async function api<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const userStore = useUserStore()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (userStore.token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${userStore.token}`
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(await response.text()) // or custom error handler
  }

  return response.json()
}
