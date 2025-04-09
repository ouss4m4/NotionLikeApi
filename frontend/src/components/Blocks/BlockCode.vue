<template>
  <code class="text-xl font-semibold">{{ block.content }}</code>
</template>

<script setup lang="ts">
import type { IBlock } from '@/typings/document.typings'
defineProps<{ block: IBlock }>()
</script>
