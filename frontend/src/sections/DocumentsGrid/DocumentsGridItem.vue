<script setup lang="ts">
const props = defineProps<{
  document: IDocument
}>()

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { timeAgo } from '@/lib/utils';
import type { IDocument } from '@/typings/document.typings';


const { id, title, tags, createdAt, updatedAt, author } = props.document;

</script>

<template>
  <RouterLink :to="`/documents/${id}`" class="block no-underline text-inherit">
    <Card class="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle class="truncate w-full overflow-hidden whitespace-nowrap">
          {{ title.toUpperCase() }}
        </CardTitle>
        <CardDescription>
          <div class="flex gap-2 text-sm">
            <span v-for="(tag, index) in tags" :key="`${tag}-${index}-${id}`">#{{ tag }}</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent class="text-sm space-y-2 grow">
        <p>Created On: {{ timeAgo(createdAt) }}</p>
        <p>Last Updated At: {{ timeAgo(updatedAt) }}</p>
        <p>By {{ author.name }} - {{ author.email }}</p>
      </CardContent>
    </Card>
  </RouterLink>
</template>
