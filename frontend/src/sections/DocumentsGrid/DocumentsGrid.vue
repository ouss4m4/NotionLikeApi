<script setup lang="ts">
import { api } from '@/lib/api';
import DocumentsGridItem from '@/sections/DocumentsGrid/DocumentsGridItem.vue';
import type { IDocument } from '@/typings/document.typings';

import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const documents = ref<IDocument[]>([])

onMounted(async () => {
  try {
    documents.value = await api<IDocument[]>(`/documents`)

  } finally {
    isLoading.value = false
  }
})

</script>
<template>
  <div class="grid grid-cols-3 w-full gap-4">
    <div v-if="isLoading">Loading...</div>
    <DocumentsGridItem v-else v-for="doc in documents" :key="doc.id" :document="doc" />

  </div>
</template>
