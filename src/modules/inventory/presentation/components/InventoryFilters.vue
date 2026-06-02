<script setup lang="ts">
import { Search, Filter, ChevronDown } from '@lucide/vue'
import labels from '@/modules/inventory/labels'

defineProps<{
  search: string
  category: string
  status: string
  categories: string[]
  resultCount: number
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:category': [value: string]
  'update:status': [value: string]
}>()

const selectClass =
  'w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1'
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-2 shrink-0">
    <!-- Search -->
    <div class="relative flex-1">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        :placeholder="labels.searchPlaceholder"
        :value="search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
      />
    </div>

    <div class="flex gap-2">
      <!-- Category -->
      <div class="relative flex-1 sm:flex-none">
        <select
          :value="category"
          @change="emit('update:category', ($event.target as HTMLSelectElement).value)"
          :class="selectClass"
        >
          <option value="all">{{ labels.filterAllCategories }}</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <ChevronDown
          class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none"
        />
      </div>

      <!-- Status -->
      <div class="relative flex-1 sm:flex-none">
        <select
          :value="status"
          @change="emit('update:status', ($event.target as HTMLSelectElement).value)"
          :class="selectClass"
        >
          <option value="all">{{ labels.filterStatus }}</option>
          <option value="active">{{ labels.statusActive }}</option>
          <option value="low">{{ labels.statusLow }}</option>
          <option value="out">{{ labels.statusOut }}</option>
        </select>
        <ChevronDown
          class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none"
        />
      </div>
    </div>

    <!-- Result count -->
    <div
      class="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap"
    >
      <Filter class="w-3.5 h-3.5" />
      {{ resultCount }} {{ resultCount !== 1 ? labels.resultsPlural : labels.results }}
    </div>
  </div>
</template>
