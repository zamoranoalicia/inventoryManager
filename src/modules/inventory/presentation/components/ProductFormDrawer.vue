<script setup lang="ts">
import { reactive, computed } from 'vue'
import {
  X,
  Barcode,
  Hash,
  Package,
  FileText,
  Tag,
  Shield,
  FlaskConical,
  Clipboard,
  TrendingDown,
} from '@lucide/vue'
import labels, { CATEGORIES } from '@/modules/inventory/labels'
import { Product } from '@/modules/inventory/domain/models/Product'
import type { ProductType } from '@/types'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'

const props = defineProps<{ product: Product }>()

const emit = defineEmits<{
  save: [product: Product]
  close: []
}>()

const isEdit = computed(() => Boolean(props.product.id))

// Local editable copy of the product (reorderLevel kept as string for the number input).
const form = reactive({
  id: props.product.id,
  sku: props.product.sku,
  barCode: props.product.barCode,
  productName: props.product.productName,
  productDescription: props.product.productDescription,
  category: props.product.category,
  prescriptionRequired: props.product.prescriptionRequired,
  controlledSubstance: props.product.controlledSubstance,
  laboratoryId: props.product.laboratoryId,
  brandId: props.product.brandId,
  sanitaryRegistration: props.product.sanitaryRegistration,
  reorderLevel: props.product.reorderLevel ? String(props.product.reorderLevel) : '',
})

type FieldKey = 'sku' | 'productName' | 'category' | 'reorderLevel'
const errors = reactive<Partial<Record<FieldKey, string>>>({})

function clearError(key: FieldKey) {
  if (errors[key]) errors[key] = undefined
}

function validate(): boolean {
  errors.sku = !form.sku.trim() ? labels.required : undefined
  errors.productName = !form.productName.trim() ? labels.required : undefined
  errors.category = !form.category ? labels.required : undefined
  errors.reorderLevel =
    form.reorderLevel && isNaN(Number(form.reorderLevel)) ? labels.mustBeNumber : undefined
  return !errors.sku && !errors.productName && !errors.category && !errors.reorderLevel
}

function handleSubmit() {
  if (!validate()) return
  const data: ProductType = {
    id: form.id || undefined,
    sku: form.sku,
    barCode: form.barCode,
    productName: form.productName,
    productDescription: form.productDescription,
    category: form.category,
    prescriptionRequired: form.prescriptionRequired,
    controlledSubstance: form.controlledSubstance,
    laboratoryId: form.laboratoryId,
    brandId: form.brandId,
    sanitaryRegistration: form.sanitaryRegistration,
    reorderLevel: form.reorderLevel ? Number(form.reorderLevel) : 0,
  }
  emit('save', new Product(data))
}

const baseInput =
  'w-full px-3 py-2 rounded-md border text-sm bg-input-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1'
function inputClass(hasError?: string) {
  return [baseInput, hasError ? 'border-destructive' : 'border-border']
}
</script>

<template>
  <!-- Backdrop -->
  <div class="fixed inset-0 z-50 flex">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />

    <!-- Drawer — bottom sheet on mobile, right panel on desktop -->
    <div
      class="relative mt-auto sm:mt-0 sm:ml-auto w-full sm:max-w-xl bg-card h-auto sm:h-full flex flex-col shadow-2xl rounded-t-2xl sm:rounded-none max-h-[95dvh] sm:max-h-full"
    >
      <!-- Drag handle – mobile only -->
      <div class="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
        <div class="w-10 h-1 rounded-full bg-border" />
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package class="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 class="text-foreground">{{ isEdit ? labels.formEditTitle : labels.formTitle }}</h2>
            <p class="text-xs text-muted-foreground">{{ labels.formSubtitle }}</p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="w-8 h-8 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
        >
          <X class="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <!-- Form body -->
      <form class="flex-1 overflow-y-auto px-5 py-5 space-y-4" @submit.prevent="handleSubmit">
        <!-- SKU + Barcode -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="flex items-center gap-1.5 text-sm text-foreground mb-1.5">
              <Hash class="w-3.5 h-3.5 text-muted-foreground" />
              {{ labels.fieldSku }}
              <span class="text-destructive">*</span>
            </label>
            <input
              type="text"
              :class="inputClass(errors.sku)"
              :placeholder="labels.phSku"
              v-model="form.sku"
              @input="clearError('sku')"
            />
            <p v-if="errors.sku" class="text-xs text-destructive mt-1">{{ errors.sku }}</p>
          </div>
          <div>
            <label class="flex items-center gap-1.5 text-sm text-foreground mb-1.5">
              <Barcode class="w-3.5 h-3.5 text-muted-foreground" />
              {{ labels.fieldBarCode }}
            </label>
            <input
              type="text"
              :class="inputClass()"
              :placeholder="labels.phBarCode"
              v-model="form.barCode"
            />
          </div>
        </div>

        <!-- Nombre -->
        <div>
          <label class="flex items-center gap-1.5 text-sm text-foreground mb-1.5">
            <Package class="w-3.5 h-3.5 text-muted-foreground" />
            {{ labels.fieldProductName }}
            <span class="text-destructive">*</span>
          </label>
          <input
            type="text"
            :class="inputClass(errors.productName)"
            :placeholder="labels.phProductName"
            v-model="form.productName"
            @input="clearError('productName')"
          />
          <p v-if="errors.productName" class="text-xs text-destructive mt-1">
            {{ errors.productName }}
          </p>
        </div>

        <!-- Descripción -->
        <div>
          <label class="flex items-center gap-1.5 text-sm text-foreground mb-1.5">
            <FileText class="w-3.5 h-3.5 text-muted-foreground" />
            {{ labels.fieldDescription }}
          </label>
          <textarea
            :class="[...inputClass(), 'resize-none']"
            rows="3"
            :placeholder="labels.phDescription"
            v-model="form.productDescription"
          />
        </div>

        <!-- Categoría -->
        <div>
          <label class="flex items-center gap-1.5 text-sm text-foreground mb-1.5">
            <Tag class="w-3.5 h-3.5 text-muted-foreground" />
            {{ labels.fieldCategory }}
            <span class="text-destructive">*</span>
          </label>
          <select
            :class="inputClass(errors.category)"
            v-model="form.category"
            @change="clearError('category')"
          >
            <option value="">{{ labels.selectCategory }}</option>
            <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <p v-if="errors.category" class="text-xs text-destructive mt-1">{{ errors.category }}</p>
        </div>

        <!-- Registro Sanitario + Reorden -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="flex items-center gap-1.5 text-sm text-foreground mb-1.5">
              <Clipboard class="w-3.5 h-3.5 text-muted-foreground" />
              {{ labels.fieldSanitaryRegistration }}
            </label>
            <input
              type="text"
              :class="inputClass()"
              :placeholder="labels.phSanitaryRegistration"
              v-model="form.sanitaryRegistration"
            />
          </div>
          <div>
            <label class="flex items-center gap-1.5 text-sm text-foreground mb-1.5">
              <TrendingDown class="w-3.5 h-3.5 text-muted-foreground" />
              {{ labels.fieldReorderLevel }}
            </label>
            <input
              type="number"
              min="0"
              :class="inputClass(errors.reorderLevel)"
              :placeholder="labels.phReorderLevel"
              v-model="form.reorderLevel"
              @input="clearError('reorderLevel')"
            />
            <p v-if="errors.reorderLevel" class="text-xs text-destructive mt-1">
              {{ errors.reorderLevel }}
            </p>
          </div>
        </div>

        <!-- Regulatory toggles -->
        <div class="border-t border-border pt-4">
          <p class="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            {{ labels.regulatoryControl }}
          </p>
          <div class="space-y-3">
            <div
              class="flex items-center justify-between gap-4 py-3 px-4 rounded-lg bg-accent/40"
            >
              <div class="flex items-start gap-2.5 min-w-0">
                <Shield class="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div class="min-w-0">
                  <p class="text-sm text-foreground">{{ labels.prescriptionRequired }}</p>
                  <p class="text-xs text-muted-foreground">{{ labels.prescriptionRequiredHint }}</p>
                </div>
              </div>
              <BaseSwitch v-model="form.prescriptionRequired" />
            </div>

            <div
              class="flex items-center justify-between gap-4 py-3 px-4 rounded-lg bg-accent/40"
            >
              <div class="flex items-start gap-2.5 min-w-0">
                <FlaskConical class="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div class="min-w-0">
                  <p class="text-sm text-foreground">{{ labels.controlledSubstance }}</p>
                  <p class="text-xs text-muted-foreground">{{ labels.controlledSubstanceHint }}</p>
                </div>
              </div>
              <BaseSwitch v-model="form.controlledSubstance" />
            </div>
          </div>

          <div
            v-if="form.controlledSubstance"
            class="mt-3 flex items-start gap-2 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200"
          >
            <Shield class="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p class="text-xs text-amber-700">{{ labels.controlledWarning }}</p>
          </div>
        </div>
      </form>

      <!-- Footer -->
      <div
        class="flex items-center justify-end gap-3 px-5 py-4 border-t border-border bg-card shrink-0"
      >
        <button
          type="button"
          @click="emit('close')"
          class="px-4 py-2 text-sm rounded-md border border-border bg-background hover:bg-accent transition-colors"
        >
          {{ labels.cancel }}
        </button>
        <button
          type="button"
          @click="handleSubmit"
          class="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Package class="w-3.5 h-3.5" />
          {{ labels.saveProduct }}
        </button>
      </div>
    </div>
  </div>
</template>
