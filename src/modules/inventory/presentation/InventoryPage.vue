<template>
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <Button
          label="New"
          icon="pi pi-plus"
          class="p-button-success mr-2"
          @click="openNew"
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          class="p-button-danger"
          @click="confirmDeleteSelected"
          :disabled="!selectedProducts || !selectedProducts.length"
        />
      </template>
      <template #end>
        <FileUpload
          mode="basic"
          accept="image/*"
          :maxFileSize="1000000"
          label="Import"
          chooseLabel="Import"
          class="p-mr-2 p-d-inline-block"
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          class="p-button-help"
          @click="exportCSV"
        />
      </template>
    </Toolbar>

    <DataTable
      ref="dt"
      v-model:selection="selectedProducts"
      :value="products"
      dataKey="id"
      :paginator="true"
      :rows="params.size"
      :rowsPerPageOptions="[5, 10, 25]"
      :loading="isLoading"
      :lazy="true"
      :totalRecords="total"
      @page="onPage($event)"
      @sort="onSort($event)"
      @filter="onFilter($event)"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      responsiveLayout="scroll"
      class="p-datatable-sm custom-datatable"
    >
      <template #header>
        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
          <h5 class="m-0">Manage Products</h5>
          <span class="block mt-2 md:mt-0 p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="globalFilter"
              placeholder="Search..."
            />
          </span>
        </div>
      </template>

      <Column
        selectionMode="multiple"
        headerStyle="width: 3rem"
      ></Column>
      <Column
        field="sku"
        header="SKU"
        :sortable="true"
        style="min-width:10rem"
      >
        <template #body="slotProps">
          {{ slotProps.data.sku }}
        </template>
      </Column>
      <Column
        field="productName"
        header="Name"
        :sortable="true"
        style="min-width:12rem"
      >
        <template #body="slotProps">
          {{ slotProps.data.productName }}
        </template>
      </Column>
      <Column
        field="category"
        header="Category"
        :sortable="true"
        style="min-width:10rem"
      >
        <template #body="slotProps">
          <span class="badge badge-secondary">
            {{ slotProps.data.category }}
          </span>
        </template>
      </Column>
      <Column
        field="reorderLevel"
        header="Reorder Level"
        :sortable="true"
        style="min-width:10rem"
      >
        <template #body="slotProps">
          {{ slotProps.data.reorderLevel }}
        </template>
      </Column>
      <Column
        header="Actions"
        style="min-width:10rem"
      >
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success mr-2"
            @click="editProduct(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-warning"
            @click="confirmDeleteProduct(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Product Details"
      :modal="true"
      class="p-fluid"
    >
      <ProductForm
        :product="product"
        @update="product = $event"
      />
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveProduct"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle mr-3"
          style="font-size: 2rem"
        />
        <span v-if="product">
          Are you sure you want to delete <b>{{ product.productName }}</b>?
        </span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteProd"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle mr-3"
          style="font-size: 2rem"
        />
        <span>
          Are you sure you want to delete the selected products?
        </span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductsDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import { Product } from '@/modules/inventory/domain/models/Product';
import { useInventory } from '@/modules/inventory/application/useInventory';
import ProductForm from './components/ProductForm.vue';

const params = reactive({
  page: 0,
  size: 10,
  sortField: '',
  sortOrder: 0,
  filters: {},
});

const {
  products,
  total,
  isLoading,
  createProduct,
  updateProduct,
  deleteProduct,
} = useInventory(params);

const toast = useToast();
const confirm = useConfirm();

const dt = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref(
  new Product({
    id: '',
    sku: '',
    barCode: '',
    productName: '',
    productDescription: '',
    category: '',
    prescriptionRequired: false,
    controlledSubstance: false,
    laboratoryId: null,
    brandId: null,
    sanitaryRegistration: '',
    reorderLevel: 0,
  })
);
const selectedProducts = ref([]);
const globalFilter = ref('');

const openNew = () => {
  product.value = new Product({
    id: '',
    sku: '',
    barCode: '',
    productName: '',
    productDescription: '',
    category: '',
    prescriptionRequired: false,
    controlledSubstance: false,
    laboratoryId: null,
    brandId: null,
    sanitaryRegistration: '',
    reorderLevel: 0,
  });
  productDialog.value = true;
};

const hideDialog = () => {
  productDialog.value = false;
};

const saveProduct = () => {
  if (product.value.id) {
    updateProduct({ id: product.value.id, product: product.value });
    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Updated',
      life: 3000,
    });
  } else {
    createProduct(product.value);
    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Created',
      life: 3000,
    });
  }
  productDialog.value = false;
};

const editProduct = (prod: Product) => {
  product.value = prod;
  productDialog.value = true;
};

const confirmDeleteProduct = (prod: Product) => {
  product.value = prod;
  deleteProductDialog.value = true;
};

const deleteProd = () => {
  deleteProduct(product.value.id);
  deleteProductDialog.value = false;
  toast.add({
    severity: 'success',
    summary: 'Successful',
    detail: 'Product Deleted',
    life: 3000,
  });
};

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};

const deleteSelectedProducts = () => {
  selectedProducts.value.forEach((prod: Product) => deleteProduct(prod.id));
  deleteProductsDialog.value = false;
  selectedProducts.value = [];
  toast.add({
    severity: 'success',
    summary: 'Successful',
    detail: 'Products Deleted',
    life: 3000,
  });
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const onPage = (event: any) => {
  params.page = event.page;
  params.size = event.rows;
};

const onSort = (event: any) => {
  params.sortField = event.sortField;
  params.sortOrder = event.sortOrder;
};

const onFilter = (event: any) => {
  params.filters = event.filters;
};
</script>

<style scoped>
.custom-datatable .p-datatable-thead > tr > th {
  background-color: #f8f9fa;
  font-weight: 600;
}
.custom-datatable .p-datatable-tbody > tr:hover {
  background-color: #e9ecef;
}
.badge {
  padding: 0.25em 0.5em;
  border-radius: 0.25rem;
}
.badge-secondary {
  background-color: #6c757d;
  color: white;
}
</style>
