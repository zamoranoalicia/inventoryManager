<script setup lang="ts">
import { ref } from 'vue'
import { Check } from '@lucide/vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import SectionPlaceholder from '@/components/layout/SectionPlaceholder.vue'
import InventoryPage from '@/modules/inventory/presentation/InventoryPage.vue'
import { SECTION_LABELS, type SectionId } from '@/components/layout/sections'

const activeSection = ref<SectionId>('inventory')
const sidebarOpen = ref(false)
const savedNotif = ref<string | null>(null)
const inventoryRef = ref<InstanceType<typeof InventoryPage> | null>(null)
let notifTimer: ReturnType<typeof setTimeout> | undefined

function notify(message: string) {
  savedNotif.value = message
  if (notifTimer) clearTimeout(notifTimer)
  notifTimer = setTimeout(() => {
    savedNotif.value = null
  }, 4000)
}

function handleAddProduct() {
  inventoryRef.value?.openNew()
}
</script>

<template>
  <div class="flex h-screen w-screen bg-background overflow-hidden">
    <AppSidebar
      :active-section="activeSection"
      :is-open="sidebarOpen"
      @section-change="activeSection = $event"
      @close="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader
        :active-section="activeSection"
        @toggle-sidebar="sidebarOpen = true"
        @add-product="handleAddProduct"
      />

      <main class="flex-1 overflow-y-auto p-4 sm:p-6">
        <InventoryPage
          v-if="activeSection === 'inventory'"
          ref="inventoryRef"
          @notify="notify"
        />
        <SectionPlaceholder v-else :title="SECTION_LABELS[activeSection]" />
      </main>
    </div>

    <!-- Success notification -->
    <div
      v-if="savedNotif"
      class="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-auto z-50 flex items-center gap-3 bg-foreground text-background px-4 py-3 rounded-xl shadow-xl text-sm"
    >
      <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
        <Check class="w-3 h-3 text-white" />
      </div>
      {{ savedNotif }}
    </div>
  </div>
</template>
