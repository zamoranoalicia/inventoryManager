<template>
  <div class="inventory-table-container">
    <div class="table-header">
      <h2 class="table-title">Product Inventory</h2>
      <div class="table-info">
        <span class="total-count">Total Products: <strong>{{ total }}</strong></span>
      </div>
    </div>

    <DataTable
      :value="products"
      :lazy="true"
      :loading="isLoading"
      :totalRecords="total"
      :rows="rows"
      :first="first"
      @page="onPage"
      @sort="onSort"
      @filter="onFilter"
      paginator
      :rowsPerPageOptions="[5, 10, 20]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      responsiveLayout="scroll"
      stripedRows
      class="p-datatable-striped p-datatable-sm"
      :globalFilterFields="['sku', 'productName', 'category']"
    >
      <!-- SKU Column -->
      <Column field="sku" header="SKU" sortable style="min-width: 12rem">
        <template #body="slotProps">
          <div class="sku-cell">
            <span class="sku-badge">{{ slotProps.data.sku }}</span>
          </div>
        </template>
      </Column>

      <!-- Product Name Column -->
      <Column field="productName" header="Product Name" sortable style="min-width: 15rem">
        <template #body="slotProps">
          <div class="product-cell">
            <div class="product-name">{{ slotProps.data.productName }}</div>
            <div class="product-description">{{ slotProps.data.productDescription }}</div>
          </div>
        </template>
      </Column>

      <!-- Category Column -->
      <Column field="category" header="Category" sortable style="min-width: 12rem">
        <template #body="slotProps">
          <div class="category-cell">
            <span class="category-badge" :class="getCategoryClass(slotProps.data.category)">
              {{ slotProps.data.category }}
            </span>
          </div>
        </template>
      </Column>

      <!-- Reorder Level Column -->
      <Column field="reorderLevel" header="Reorder Level" sortable style="min-width: 12rem">
        <template #body="slotProps">
          <div class="reorder-cell">
            <span class="reorder-badge" :class="getReorderClass(slotProps.data.reorderLevel)">
              {{ slotProps.data.reorderLevel }} units
            </span>
          </div>
        </template>
      </Column>

      <!-- Status Column -->
      <Column header="Status" style="min-width: 10rem">
        <template #body="slotProps">
          <div class="status-cell">
            <span v-if="slotProps.data.prescriptionRequired" class="status-badge prescription">
              <i class="pi pi-exclamation-circle"></i> Rx Required
            </span>
            <span v-if="slotProps.data.controlledSubstance" class="status-badge controlled">
              <i class="pi pi-shield"></i> Controlled
            </span>
            <span v-if="!slotProps.data.prescriptionRequired && !slotProps.data.controlledSubstance" class="status-badge normal">
              <i class="pi pi-check-circle"></i> Normal
            </span>
          </div>
        </template>
      </Column>

      <!-- Actions Column -->
      <Column header="Actions" style="min-width: 10rem">
        <template #body="slotProps">
          <div class="actions-cell">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-sm"
              @click="editProduct(slotProps.data)"
              v-tooltip="'Edit Product'"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-sm"
              @click="confirmDelete(slotProps.data)"
              v-tooltip="'Delete Product'"
            />
          </div>
        </template>
      </Column>

      <!-- Empty State -->
      <template #empty>
        <div class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>No products found. Start by adding a new product!</p>
        </div>
      </template>

      <!-- Loading State -->
      <template #loading>
        <div class="loading-state">
          <ProgressSpinner strokeWidth="4" style="width: 50px; height: 50px" />
        </div>
      </template>
    </DataTable>

    <!-- Confirmation Dialog -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import ProgressSpinner from 'primevue/progressspinner'
import { useConfirm } from 'primevue/useconfirm'
import Tooltip from 'primevue/tooltip'
import { useInventory } from '../../application/useInventory'

const emit = defineEmits<{
  edit: [product: any]
}>()

const confirm = useConfirm()

const rows = ref(10)
const first = ref(0)
const sortField = ref('')
const sortOrder = ref(0)
const filters = ref({})

const params = reactive({
  page: 0,
  size: rows.value,
  sortField: sortField.value,
  sortOrder: sortOrder.value,
  filters: filters.value,
})

const { products, total, isLoading, deleteProduct } = useInventory(params)

const onPage = (event: any) => {
  params.page = event.page
  params.size = event.rows
  first.value = event.first
}

const onSort = (event: any) => {
  params.sortField = event.sortField
  params.sortOrder = event.sortOrder
}

const onFilter = (event: any) => {
  params.filters = event.filters
}

const confirmDelete = (product: any) => {
  confirm.require({
    message: `Are you sure you want to delete <strong>${product.productName}</strong>?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      deleteProduct(product.id)
    },
  })
}

const editProduct = (product: any) => {
  emit('edit', product)
}

// Helper methods for styling
const getCategoryClass = (category: string): string => {
  const categoryClasses: Record<string, string> = {
    MEDICINE: 'medicine',
    SUPPLEMENT: 'supplement',
    DEVICE: 'device',
    OTHER: 'other',
  }
  return categoryClasses[category] || 'other'
}

const getReorderClass = (level: number): string => {
  if (level > 500) return 'high'
  if (level > 200) return 'medium'
  return 'low'
}
</script>

<style scoped lang="postcss">
.inventory-table-container {
  @apply w-full bg-white rounded-lg shadow-sm;
  padding: 1.5rem;
}

/* Header Styling */
.table-header {
  @apply flex justify-between items-center mb-6 pb-4 border-b;
  border-color: var(--primary-100);
}

.table-title {
  @apply text-2xl font-bold;
  color: var(--primary-800);
  margin: 0;
}

.table-info {
  @apply text-sm;
  color: var(--text-color-secondary);
}

.total-count {
  @apply flex items-center gap-2;
}

.total-count strong {
  @apply font-semibold;
  color: var(--primary-600);
  font-size: 1.1rem;
}

/* DataTable Overrides */
:deep(.p-datatable) {
  @apply border-0;
  background: transparent;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  @apply font-bold text-sm;
  background: var(--primary-50);
  color: var(--primary-800);
  border-color: var(--primary-200);
  padding: 1rem 1.25rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  @apply border-b transition-all duration-200;
  border-color: var(--surface-border);
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  @apply bg-blue-50;
  background-color: var(--primary-50);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  @apply py-4 px-5;
  border-color: var(--surface-border);
}

:deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(odd)) {
  @apply bg-gray-50;
  background-color: var(--surface-ground);
}

/* Cell Styling */
.sku-cell {
  @apply flex items-center;
}

.sku-badge {
  @apply inline-block px-3 py-1.5 rounded-full font-mono text-xs font-bold;
  background-color: var(--primary-100);
  color: var(--primary-700);
  letter-spacing: 0.05em;
}

.product-cell {
  @apply flex flex-col gap-1;
}

.product-name {
  @apply font-semibold text-sm;
  color: var(--text-color);
}

.product-description {
  @apply text-xs;
  color: var(--text-color-secondary);
  max-width: 300px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-cell {
  @apply flex items-center;
}

.category-badge {
  @apply inline-block px-3 py-1.5 rounded-lg font-semibold text-xs;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.category-badge.medicine {
  @apply bg-red-100 text-red-700;
}

.category-badge.supplement {
  @apply bg-green-100 text-green-700;
}

.category-badge.device {
  @apply bg-blue-100 text-blue-700;
}

.category-badge.other {
  @apply bg-gray-100 text-gray-700;
}

.reorder-cell {
  @apply flex items-center;
}

.reorder-badge {
  @apply inline-block px-3 py-1.5 rounded-lg font-semibold text-xs;
  transition: all 0.3s ease;
}

.reorder-badge.high {
  @apply bg-green-100 text-green-700;
}

.reorder-badge.medium {
  @apply bg-yellow-100 text-yellow-700;
}

.reorder-badge.low {
  @apply bg-orange-100 text-orange-700;
}

.status-cell {
  @apply flex items-center gap-2;
}

.status-badge {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold;
  white-space: nowrap;
}

.status-badge.prescription {
  @apply bg-red-100 text-red-700;
}

.status-badge.controlled {
  @apply bg-purple-100 text-purple-700;
}

.status-badge.normal {
  @apply bg-green-100 text-green-700;
}

.status-badge i {
  @apply text-sm;
}

/* Actions Cell */
.actions-cell {
  @apply flex items-center gap-2;
}

:deep(.actions-cell .p-button) {
  @apply transition-all duration-200;
}

:deep(.actions-cell .p-button:hover) {
  @apply transform scale-110;
}

/* Empty State */
.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.empty-state i {
  @apply text-6xl mb-4;
  color: var(--primary-200);
}

.empty-state p {
  @apply text-gray-500 text-base;
  margin: 0;
}

/* Loading State */
.loading-state {
  @apply flex items-center justify-center py-12;
}

/* Paginator Styling */
:deep(.p-paginator) {
  @apply bg-transparent border-t py-4 mt-4;
  border-color: var(--primary-100);
}

:deep(.p-paginator .p-paginator-current) {
  @apply text-sm font-semibold;
  color: var(--primary-700);
}

:deep(.p-paginator-rpp-options) {
  @apply ml-auto;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  @apply bg-primary-500 text-white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .inventory-table-container {
    padding: 1rem;
  }

  .table-header {
    @apply flex-col gap-3 items-start;
  }

  .table-title {
    @apply text-xl;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th) {
    @apply text-xs;
    padding: 0.75rem 0.5rem;
  }

  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    @apply py-3 px-2;
    font-size: 0.875rem;
  }

  .product-description {
    display: none;
  }

  .actions-cell {
    @apply flex-col gap-1;
  }

  :deep(.p-datatable) {
    font-size: 0.875rem;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .inventory-table-container {
    @apply bg-gray-900;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th) {
    @apply bg-gray-800;
    color: var(--primary-400);
  }

  :deep(.p-datatable .p-datatable-tbody > tr:hover) {
    @apply bg-gray-800;
  }

  :deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(odd)) {
    @apply bg-gray-800;
  }

  .empty-state i {
    color: var(--primary-700);
  }
}
</style>
