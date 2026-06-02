<script setup lang="ts">
import { Shield, FlaskConical, TrendingDown, Pencil, Trash2 } from '@lucide/vue'
import labels from '@/modules/inventory/labels'
import type { Product } from '@/modules/inventory/domain/models/Product'
import { statusConfig, stockDisplay, isLowStock } from '../productStatus'
import BaseBadge from '@/components/ui/BaseBadge.vue'

defineProps<{
  products: Product[]
  total: number
  controlledCount: number
}>()

const emit = defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
}>()

const columns = [
  labels.sku,
  labels.colProduct,
  labels.fieldCategory,
  labels.colStock,
  labels.colReorderLevel,
  labels.colFlags,
  labels.colStatus,
  '',
]
</script>

<template>
  <div
    class="hidden md:flex flex-col flex-1 bg-card border border-border rounded-xl overflow-hidden min-h-0"
  >
    <div class="overflow-auto flex-1">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border bg-accent/30">
            <th
              v-for="(h, i) in columns"
              :key="i"
              class="text-left px-4 py-3 text-xs text-muted-foreground whitespace-nowrap"
            >
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="products.length === 0">
            <td :colspan="columns.length" class="text-center py-16 text-muted-foreground text-sm">
              {{ labels.emptyProducts }}
            </td>
          </tr>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b border-border hover:bg-accent/20 transition-colors"
          >
            <td class="px-4 py-3">
              <span
                class="font-mono text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded"
              >
                {{ product.sku }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div>
                <p class="text-foreground">{{ product.productName }}</p>
                <p v-if="product.barCode" class="text-xs text-muted-foreground font-mono">
                  {{ product.barCode }}
                </p>
              </div>
            </td>
            <td class="px-4 py-3 text-muted-foreground whitespace-nowrap">
              {{ product.category || '—' }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1.5">
                <span :class="statusConfig(product).textClass">{{ stockDisplay(product) }}</span>
                <TrendingDown v-if="isLowStock(product)" class="w-3.5 h-3.5 text-amber-500" />
              </div>
            </td>
            <td class="px-4 py-3 text-muted-foreground">{{ product.reorderLevel || '—' }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1.5">
                <BaseBadge
                  v-if="product.prescriptionRequired"
                  class="bg-blue-50 text-blue-700 px-1.5"
                >
                  <Shield class="w-3 h-3" /> {{ labels.flagRxShort }}
                </BaseBadge>
                <BaseBadge
                  v-if="product.controlledSubstance"
                  class="bg-purple-50 text-purple-700 px-1.5"
                >
                  <FlaskConical class="w-3 h-3" /> {{ labels.flagControlledShort }}
                </BaseBadge>
                <span
                  v-if="!product.prescriptionRequired && !product.controlledSubstance"
                  class="text-xs text-muted-foreground"
                  >—</span
                >
              </div>
            </td>
            <td class="px-4 py-3">
              <BaseBadge pill :class="statusConfig(product).badgeClass">
                {{ statusConfig(product).label }}
              </BaseBadge>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1">
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="px-4 py-3 border-t border-border bg-accent/10 flex items-center justify-between text-xs text-muted-foreground shrink-0"
    >
      <span>
        {{
          labels.showingCount
            .replace('{shown}', String(products.length))
            .replace('{total}', String(total))
        }}
      </span>
      <div v-if="controlledCount > 0" class="flex items-center gap-1.5 text-purple-600">
        <FlaskConical class="w-3.5 h-3.5" />
        {{
          (controlledCount !== 1 ? labels.controlledCountMany : labels.controlledCountOne).replace(
            '{count}',
            String(controlledCount),
          )
        }}
      </div>
    </div>
  </div>
</template>
