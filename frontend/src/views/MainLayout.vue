<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full  h-screen overflow-scroll">
      <SidebarTrigger />
      <div class="px-4 ">
        <RouterView />
      </div>
    </main>
  </SidebarProvider>
</template>
