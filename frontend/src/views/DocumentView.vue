<script setup lang="ts">
import { useRoute } from 'vue-router'
import DocumentDetails from '@/sections/DocumentDetails/DocumentDetails.vue'
import { useDocumentStore } from '@/stores/document'
import { storeToRefs } from 'pinia'

const route = useRoute()
const store = useDocumentStore()
const { fetchDocument } = store
const { document, isLoading } = storeToRefs(store)
fetchDocument(route.params.id as string)

</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="document">
    <DocumentDetails />
  </div>
  <div v-else>Document Not Found</div>
</template>
