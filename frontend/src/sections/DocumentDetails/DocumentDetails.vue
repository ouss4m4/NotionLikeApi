<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { useDocumentStore } from '@/stores/document'
import { format } from 'date-fns'

// Import block components
import BlockHeading from '@/components/Blocks/BlockHeading.vue'
import BlockList from '@/components/Blocks/BlockList.vue'
import BlockText from '@/components/Blocks/BlockText.vue'
import BlockImage from '@/components/Blocks/BlockImage.vue'
import BlockCode from '@/components/Blocks/BlockCode.vue'
import BlockBuilder from '../BlockBuilder/BlockBuilder.vue'
import type { IBlock } from '@/typings/document.typings'
import { storeToRefs } from 'pinia'


const documentStore = useDocumentStore();
const { document } = storeToRefs(documentStore);


// Helpers
const formatDate = (date: string) => format(new Date(date), 'dd-MM-yyyy HH:mm')

function getBlockComponent(block: IBlock) {
  switch (block.type) {
    case 'heading':
      return BlockHeading
    case 'list':
      return BlockList
    case 'image':
      return BlockImage
    case 'code':
      return BlockCode
    // case 'embed':
    //   return 'BlockEmbed'
    default:
      return BlockText
  }
}
</script>


<template>
  <div v-if="document">
    <div class="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <!-- Title -->
      <h1 class="text-3xl font-bold break-words">{{ document.title }}</h1>

      <!-- Metadata -->
      <div class="text-sm text-muted-foreground flex items-center justify-between">
        <div>By {{ document.author.name }} &middot; {{ document.author.email }}</div>
        <div>
          Created: {{ formatDate(document.createdAt) }} | Updated: {{ formatDate(document.updatedAt) }}
        </div>
      </div>

      <!-- Tags -->
      <div class="flex gap-2 flex-wrap">
        <span v-for="(tag, index) in document.tags" :key="`${tag}-${index}`"
          class="text-xs bg-muted px-2 py-1 rounded-md">
          #{{ tag }}
        </span>
      </div>

      <!-- Blocks -->
      <div class="space-y-4 pt-4">
        <template v-for="block in document.blocks" :key="block.id">
          <component :is="getBlockComponent(block)" :block="block" />
        </template>
      </div>

      <BlockBuilder />
    </div>
  </div>
</template>
