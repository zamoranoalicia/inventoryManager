<script setup lang="ts">
import { computed } from 'vue'
import { Shield, FlaskConical, TrendingDown, Pencil, Trash2 } from '@lucide/vue'
import labels from '@/modules/inventory/labels'
import type { Product } from '@/modules/inventory/domain/models/Product'
import { statusConfig, stockDisplay, isLowStock } from '../productStatus'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const props = defineProps<{ product: Product }>()

const emit = defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
}>()

const status = computed(() => statusConfig(props.product))
const stock = computed(() => stockDisplay(props.product))
const low = computed(() => isLowStock(props.product))
</script>

<template>
  <div class="bg-card border border-border rounded-xl p-4 space-y-3">
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1 min-w-0">
        <p class="text-foreground truncate">{{ product.productName }}</p>
        <p class="text-xs text-muted-foreground font-mono mt-0.5">{{ product.sku }}</p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <BaseBadge pill :class="status.badgeClass">{{ status.label }}</BaseBadge>
        <button
          @click="emit('edit', product)"
          class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
        >
          <Pencil class="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          @click="emit('delete', product)"
          class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
        >
          <Trash2 class="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="bg-accent/40 rounded-lg px-3 py-2">
        <p class="text-muted-foreground">{{ labels.fieldCategory }}</p>
        <p class="text-foreground mt-0.5 truncate">{{ product.category || '—' }}</p>
      </div>
      <div class="bg-accent/40 rounded-lg px-3 py-2">
        <p class="text-muted-foreground">{{ labels.statActive }}</p>
        <p :class="['mt-0.5 flex items-center gap-1', status.textClass]">
          {{ stock }}
          <TrendingDown v-if="low" class="w-3 h-3" />
        </p>
      </div>
      <div class="bg-accent/40 rounded-lg px-3 py-2">
        <p class="text-muted-foreground">{{ labels.colReorderLevel }}</p>
        <p class="text-foreground mt-0.5">{{ product.reorderLevel }}</p>
      </div>
      <div v-if="product.barCode" class="bg-accent/40 rounded-lg px-3 py-2">
        <p class="text-muted-foreground">{{ labels.fieldBarCode }}</p>
        <p class="text-foreground font-mono mt-0.5 truncate">{{ product.barCode }}</p>
      </div>
    </div>

    <div
      v-if="product.prescriptionRequired || product.controlledSubstance"
      class="flex items-center gap-1.5 pt-1 border-t border-border"
    >
      <BaseBadge v-if="product.prescriptionRequired" class="bg-blue-50 text-blue-700">
        <Shield class="w-3 h-3" /> {{ labels.flagRx }}
      </BaseBadge>
      <BaseBadge v-if="product.controlledSubstance" class="bg-purple-50 text-purple-700">
        <FlaskConical class="w-3 h-3" /> {{ labels.flagControlled }}
      </BaseBadge>
    </div>
  </div>
</template>
