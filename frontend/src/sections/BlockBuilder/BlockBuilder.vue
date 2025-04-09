<script setup lang="ts">
import { ref } from 'vue'
import { useBlockStore } from '@/stores/block'
import type { IBlock } from '@/typings/document.typings'

const blockStore = useBlockStore()

const input = ref('')
const showDropdown = ref(false)
const selectedType = ref<IBlock['type']>('text')

// Show dropdown if user types `/` as the first character
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === '/' && input.value.trim().length <= 1) {
    showDropdown.value = true
  } else {
    showDropdown.value = false
  }
}

// Create and add the block
const addBlock = async () => {
  if (!input.value.trim()) return

  await blockStore.addBlock(selectedType.value, input.value)
  input.value = ''
  selectedType.value = 'text'
}

// User selects a type from the menu
const selectType = (type: IBlock['type']) => {
  selectedType.value = type
  showDropdown.value = false
}
</script>

<template>
  <div class="relative space-y-2">
    <!-- Input -->
    <input v-model="input" @keydown="onKeydown" @keyup.enter="addBlock"
      :placeholder="`Type your ${selectedType} here...`"
      class="block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

    <!-- Slash command dropdown -->
    <div v-if="showDropdown" class="absolute z-10 mt-1 w-48 bg-white border rounded-md shadow-lg p-2 space-y-1">
      <div v-for="type in ['text', 'heading', 'list', 'code', 'image']" :key="type"
        @click="selectType(type as IBlock['type'])" class="cursor-pointer px-2 py-1 rounded hover:bg-gray-100">
        {{ type }}
      </div>
    </div>

    <!-- Fallback button (manual trigger) -->
    <button @click="addBlock" class="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
      Add Block
    </button>
  </div>
</template>
