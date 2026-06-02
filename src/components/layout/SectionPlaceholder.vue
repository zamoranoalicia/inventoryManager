<script setup lang="ts">
import { Package } from '@lucide/vue'
import labels from '@/modules/inventory/labels'

defineProps<{ title: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full text-center gap-4">
    <div class="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
      <Package class="w-8 h-8 text-muted-foreground" />
    </div>
    <div>
      <h2>{{ title }}</h2>
      <p class="text-muted-foreground text-sm mt-1">{{ labels.sectionComingSoon }}</p>
    </div>
  </div>
</template>
