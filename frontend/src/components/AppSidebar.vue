<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenu,


} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar'

import { Calendar, Home, Inbox, Search, Settings, LogOut } from "lucide-vue-next";
import { useUserStore } from '@/stores/user'

const { name, logout } = useUserStore()

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenuButton asChild>
        <SidebarMenuItem>
          <Avatar>
            <AvatarImage :src="'https://ui-avatars.com/api/?name=' + name" alt="avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{{ name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() }}</span>
        </SidebarMenuItem>
      </SidebarMenuButton>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton asChild>
                <RouterLink :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <!-- <SidebarMenuItem> -->
      <SidebarMenuButton asChild class="mb-4">
        <RouterLink @click="logout" to="#">
          <LogOut />
          <span>Logout</span>
        </RouterLink>
      </SidebarMenuButton>
    </SidebarFooter>
  </Sidebar>
</template>
