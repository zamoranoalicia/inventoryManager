<script setup lang="ts">
import { computed } from 'vue'
import { Menu, Bell, Plus } from '@lucide/vue'
import labels from '@/modules/inventory/labels'
import { SECTION_LABELS, type SectionId } from './sections'

const props = defineProps<{ activeSection: SectionId }>()

const emit = defineEmits<{
  'toggle-sidebar': []
  'add-product': []
}>()

const title = computed(() => SECTION_LABELS[props.activeSection])
const subtitle = computed(() =>
  props.activeSection === 'inventory' ? labels.inventorySubtitle : labels.sectionUnderConstruction,
)
</script>

<template>
  <header
    class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-card shrink-0 gap-3"
  >
    <div class="flex items-center gap-3 min-w-0">
      <!-- Hamburger – mobile only -->
      <button
        @click="emit('toggle-sidebar')"
        class="lg:hidden w-9 h-9 rounded-md flex items-center justify-center hover:bg-accent transition-colors shrink-0"
      >
        <Menu class="w-5 h-5 text-foreground" />
      </button>
      <div class="min-w-0">
        <h1 class="truncate">{{ title }}</h1>
        <p class="text-xs text-muted-foreground hidden sm:block">{{ subtitle }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <button
        class="relative w-9 h-9 rounded-md flex items-center justify-center hover:bg-accent transition-colors border border-border"
      >
        <Bell class="w-4 h-4 text-muted-foreground" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
      </button>
      <button
        v-if="activeSection === 'inventory'"
        @click="emit('add-product')"
        class="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus class="w-4 h-4" />
        <span class="hidden sm:inline">{{ labels.newProduct }}</span>
      </button>
    </div>
  </header>
</template>
