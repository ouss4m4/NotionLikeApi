import { defineStore } from 'pinia'
import type { IDocumentDetails } from '@/typings/document.typings'
import { ref } from 'vue'
import { api } from '@/lib/api'

export const useDocumentStore = defineStore('document', () => {
  const document = ref<IDocumentDetails | null>(null)
  const isLoading = ref(false)

  async function fetchDocument(id: string) {
    isLoading.value = true
    try {
      document.value = await api<IDocumentDetails>(`/documents/${id}/full`)
    } catch (error) {
      console.error(error)
      document.value = null
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    document.value = null
    isLoading.value = false
  }

  return { document, isLoading, fetchDocument, reset }
})
