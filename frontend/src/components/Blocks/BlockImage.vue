<template>
  <img :src="block.content" />
</template>

<script setup lang="ts">
import type { IBlock } from '@/typings/document.typings'
defineProps<{ block: IBlock }>()
</script>
