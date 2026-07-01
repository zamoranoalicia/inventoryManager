<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Package } from '@lucide/vue'
import { Product } from '@/modules/inventory/domain/models/Product'
import { useInventory } from '@/modules/inventory/application/useInventory'
import labels from '@/modules/inventory/labels'
import { deriveStatus } from './productStatus'
import InventoryStats from './components/InventoryStats.vue'
import InventoryFilters from './components/InventoryFilters.vue'
import ProductTable from './components/ProductTable.vue'
import ProductCard from './components/ProductCard.vue'
import ProductFormDrawer from './components/ProductFormDrawer.vue'

const emit = defineEmits<{ notify: [message: string] }>()

// Load a generous page so the catalog can be filtered client-side (the Figma design has no
// paginator). Server pagination/sort remain available via these params if needed later.
const params = reactive({ page: 0, size: 100, sortField: '', sortOrder: 0, filters: {} })

const { products, total, createProduct, updateProduct, deleteProduct } = useInventory(params)

function blankProduct() {
  return new Product({
    id: undefined,
    sku: '',
    barCode: '',
    productName: '',
    productDescription: '',
    category: '',
    laboratory: '',
    prescriptionRequired: false,
    controlledSubstance: false,
    laboratoryId: null,
    brandId: null,
    sanitaryRegistration: '',
    reorderLevel: 0,
  })
}

// ── Filters ──────────────────────────────────────────────────────────
const search = ref('')
const filterCategory = ref('all')
const filterStatus = ref('all')

const categories = computed(() =>
  Array.from(new Set(products.value.map((p) => p.category).filter(Boolean))),
)

const filtered = computed(() =>
  products.value.filter((p) => {
    const q = search.value.toLowerCase()
    const matchSearch =
      q === '' ||
      p.productName.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.barCode.includes(search.value)
    const matchCat = filterCategory.value === 'all' || p.category === filterCategory.value
    const matchStatus = filterStatus.value === 'all' || deriveStatus(p) === filterStatus.value
    return matchSearch && matchCat && matchStatus
  }),
)

const stats = computed(() => ({
  total: total.value || products.value.length,
  active: products.value.filter((p) => deriveStatus(p) === 'active').length,
  low: products.value.filter((p) => deriveStatus(p) === 'low').length,
  out: products.value.filter((p) => deriveStatus(p) === 'out').length,
}))

const controlledCount = computed(() => products.value.filter((p) => p.controlledSubstance).length)

// ── Drawer + CRUD ────────────────────────────────────────────────────
const drawerOpen = ref(false)
const current = ref<Product>(blankProduct())

function openNew() {
  current.value = blankProduct()
  drawerOpen.value = true
}

function editProduct(product: Product) {
  current.value = new Product({ ...product, id: product.id || undefined })
  drawerOpen.value = true
}

function saveProduct(product: Product) {
  if (product.id) {
    updateProduct({ id: product.id, product })
    emit('notify', labels.productUpdated)
  } else {
    createProduct(product)
    emit('notify', labels.productAddedToast.replace('{name}', product.productName))
  }
  drawerOpen.value = false
}

// ── Delete confirmation ──────────────────────────────────────────────
const pendingDelete = ref<Product | null>(null)

function confirmDelete(product: Product) {
  pendingDelete.value = product
}

function performDelete() {
  if (pendingDelete.value?.id) {
    deleteProduct(pendingDelete.value.id)
    emit('notify', labels.productDeleted)
  }
  pendingDelete.value = null
}

defineExpose({ openNew })
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <InventoryStats
      :total="stats.total"
      :active="stats.active"
      :low="stats.low"
      :out="stats.out"
    />

    <InventoryFilters
      v-model:search="search"
      v-model:category="filterCategory"
      v-model:status="filterStatus"
      :categories="categories"
      :result-count="filtered.length"
    />

    <!-- Mobile: card list -->
    <div class="md:hidden flex flex-col gap-3 flex-1 overflow-y-auto pb-2">
      <div
        v-if="filtered.length === 0"
        class="flex flex-col items-center justify-center py-16 gap-3 text-center"
      >
        <Package class="w-8 h-8 text-muted-foreground" />
        <p class="text-sm text-muted-foreground">{{ labels.emptyProducts }}</p>
      </div>
      <ProductCard
        v-for="product in filtered"
        :key="product.id"
        :product="product"
        @edit="editProduct"
        @delete="confirmDelete"
      />
    </div>

    <!-- Desktop: table -->
    <ProductTable
      :products="filtered"
      :total="stats.total"
      :controlled-count="controlledCount"
      @edit="editProduct"
      @delete="confirmDelete"
    />

    <!-- Product form drawer -->
    <ProductFormDrawer
      v-if="drawerOpen"
      :product="current"
      @save="saveProduct"
      @close="drawerOpen = false"
    />

    <!-- Delete confirmation -->
    <div v-if="pendingDelete" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="pendingDelete = null" />
      <div class="relative w-full max-w-sm mx-4 bg-card rounded-xl shadow-2xl p-5 space-y-4">
        <div>
          <h2 class="text-foreground">{{ labels.confirm }}</h2>
          <p class="text-sm text-muted-foreground mt-1">
            {{ labels.confirmDeleteOne }}
            <span class="text-foreground font-medium">{{ pendingDelete.productName }}</span>
          </p>
        </div>
        <div class="flex items-center justify-end gap-3">
          <button
            type="button"
            @click="pendingDelete = null"
            class="px-5 py-2 text-sm font-medium rounded-full border border-border bg-background hover:bg-accent transition-colors"
          >
            {{ labels.no }}
          </button>
          <button
            type="button"
            @click="performDelete"
            class="px-5 py-2 text-sm font-semibold rounded-full bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
          >
            {{ labels.yes }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
