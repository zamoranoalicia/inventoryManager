<script setup lang="ts">
/**
 * Small label pill. Color classes are passed via the `class` attribute by the parent
 * (e.g. `bg-emerald-50 text-emerald-700`). Use `pill` for rounded-full status badges and
 * the default for the squarer regulatory-flag badges.
 */
withDefaults(defineProps<{ pill?: boolean }>(), { pill: false })
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1 text-xs px-2 py-0.5',
      pill ? 'rounded-full' : 'rounded',
    ]"
  >
    <slot />
  </span>
</template>
