<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue'
// export const description = 'A simple login form.'
</script>
<template>
  <div class="flex h-screen w-full items-center justify-center px-4">
    <LoginForm :signup="false" />
  </div>
</template>
