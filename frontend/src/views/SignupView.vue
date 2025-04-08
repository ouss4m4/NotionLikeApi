<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue'

</script>
<template>
  <div class="flex h-screen w-full items-center justify-center px-4">
    <LoginForm :signup="true" />
  </div>
</template>
