<script setup lang="ts">
import labels from '@/modules/inventory/labels'

const props = defineProps<{
  total: number
  active: number
  low: number
  out: number
}>()

const cards = [
  { label: labels.statTotal, key: 'total', color: 'text-foreground' },
  { label: labels.statActive, key: 'active', color: 'text-emerald-600' },
  { label: labels.statLow, key: 'low', color: 'text-amber-600' },
  { label: labels.statOut, key: 'out', color: 'text-red-600' },
] as const

function valueOf(key: (typeof cards)[number]['key']) {
  return props[key]
}
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
    <div
      v-for="card in cards"
      :key="card.key"
      class="bg-card border border-border rounded-xl p-3 md:p-4"
    >
      <p class="text-xs text-muted-foreground">{{ card.label }}</p>
      <p :class="['text-2xl mt-1', card.color]">{{ valueOf(card.key) }}</p>
    </div>
  </div>
</template>
