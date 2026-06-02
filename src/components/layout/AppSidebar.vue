<script setup lang="ts">
import { Pill, AlertTriangle, ChevronRight, X } from '@lucide/vue'
import labels from '@/modules/inventory/labels'
import { NAV_ITEMS, type SectionId } from './sections'

defineProps<{
  activeSection: SectionId
  isOpen: boolean
}>()

const emit = defineEmits<{
  'section-change': [section: SectionId]
  close: []
}>()

const alerts = [
  { label: labels.alertLowStock, count: 8, color: 'text-amber-600 bg-amber-50' },
  { label: labels.alertExpiring, count: 3, color: 'text-red-600 bg-red-50' },
]

function handleNav(id: SectionId) {
  emit('section-change', id)
  emit('close')
}
</script>

<template>
  <!-- Mobile backdrop -->
  <div v-if="isOpen" class="fixed inset-0 z-30 bg-black/40 lg:hidden" @click="emit('close')" />

  <!-- Sidebar panel -->
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full transition-transform duration-300',
      'lg:static lg:translate-x-0 lg:z-auto lg:shrink-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Pill class="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <p class="text-sidebar-foreground leading-none">{{ labels.appName }}</p>
          <p class="text-xs text-muted-foreground leading-none mt-0.5">{{ labels.appTagline }}</p>
        </div>
      </div>
      <!-- Close button – mobile only -->
      <button
        @click="emit('close')"
        class="lg:hidden w-7 h-7 rounded-md flex items-center justify-center hover:bg-sidebar-accent transition-colors"
      >
        <X class="w-4 h-4 text-muted-foreground" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <p class="text-xs text-muted-foreground px-3 mb-2 uppercase tracking-wider">
        {{ labels.navGeneral }}
      </p>
      <ul class="space-y-0.5">
        <li v-for="item in NAV_ITEMS" :key="item.id">
          <button
            @click="handleNav(item.id)"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left group',
              activeSection === item.id
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            ]"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            <span class="flex-1 text-sm">{{ item.label }}</span>
            <ChevronRight v-if="activeSection === item.id" class="w-3 h-3 opacity-60" />
          </button>
        </li>
      </ul>

      <!-- Alerts -->
      <div class="mt-6">
        <p class="text-xs text-muted-foreground px-3 mb-2 uppercase tracking-wider">
          {{ labels.navAlerts }}
        </p>
        <div class="space-y-2 px-3">
          <div v-for="alert in alerts" :key="alert.label" class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-sidebar-foreground">
              <AlertTriangle class="w-3.5 h-3.5 text-amber-500" />
              {{ alert.label }}
            </div>
            <span :class="['text-xs px-2 py-0.5 rounded-full', alert.color]">{{ alert.count }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-sidebar-border">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs text-secondary-foreground shrink-0"
        >
          AD
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-sidebar-foreground truncate">{{ labels.userName }}</p>
          <p class="text-xs text-muted-foreground truncate">{{ labels.userEmail }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>
