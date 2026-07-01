<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline' | 'ghost'
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', type: 'button' },
)

const VARIANTS = {
  primary:
    'px-5 py-2 text-sm font-semibold rounded-full bg-brand-gradient text-white shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2',
  outline:
    'px-5 py-2 text-sm font-medium rounded-full border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center gap-2',
  ghost:
    'w-9 h-9 rounded-md flex items-center justify-center hover:bg-accent transition-colors',
} as const
</script>

<template>
  <button :type="type" :class="VARIANTS[variant]">
    <slot />
  </button>
</template>
