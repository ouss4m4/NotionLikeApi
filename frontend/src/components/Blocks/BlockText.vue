<template>
  <p class="text-base leading-relaxed whitespace-pre-line">{{ block.content }}</p>
</template>

<script setup lang="ts">
import type { IBlock } from '@/typings/document.typings'
defineProps<{ block: IBlock }>()
</script>
