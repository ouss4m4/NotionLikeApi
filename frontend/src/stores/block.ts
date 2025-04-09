// stores/block.ts
import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { IBlock } from '@/typings/document.typings'
import { useDocumentStore } from './document'
import { v4 as uuid } from 'uuid' // optional for local ID
import { api } from '@/lib/api'

export const useBlockStore = defineStore('block', () => {
  const documentStore = useDocumentStore()

  const blocks = computed(() => documentStore.document?.blocks || [])

  async function addBlock(type: IBlock['type'], content: unknown) {
    if (!documentStore.document) return

    const newBlock: IBlock & { workspaceId: string } = {
      id: uuid(), // temp id
      type,
      content: JSON.stringify(content),
      children: [],
      createdAt: Date.now().toString(),
      documentId: documentStore.document?.id ?? '',
      createdById: '1234', // move this to server (auth user)
      workspaceId: documentStore.document.workspaceId,
    }

    documentStore.document.blocks.push(newBlock)

    // Optionally call API here (e.g., POST /blocks)
    const resp = await api(`/blocks`, {
      method: 'POST',
      body: JSON.stringify(newBlock),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  function updateBlock(id: string, updates: Partial<IBlock>) {
    const block = blocks.value.find((b) => b.id === id)
    if (block) {
      Object.assign(block, updates)
      // Optionally call API to persist
    }
  }

  function deleteBlock(id: string) {
    if (documentStore.document) {
      documentStore.document.blocks = documentStore.document.blocks.filter((b) => b.id !== id)
      // Optionally call API to delete
    }
  }

  return {
    blocks,
    addBlock,
    updateBlock,
    deleteBlock,
  }
})
