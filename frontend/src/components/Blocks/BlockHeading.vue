<template>
  <h2 class="text-xl font-semibold">{{ block.content }}</h2>
</template>

<script setup lang="ts">
import type { IBlock } from '@/typings/document.typings'
defineProps<{ block: IBlock }>()
</script>
