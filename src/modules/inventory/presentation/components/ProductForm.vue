<template>
  <div class="p-fluid">
    <div class="field">
      <label for="sku">SKU</label>
      <InputText id="sku" v-model="product.sku" required />
    </div>
    <div class="field">
      <label for="barCode">Bar Code</label>
      <InputText id="barCode" v-model="product.barCode" />
    </div>
    <div class="field">
      <label for="productName">Product Name</label>
      <InputText id="productName" v-model="product.productName" required />
    </div>
    <div class="field">
      <label for="productDescription">Description</label>
      <Textarea id="productDescription" v-model="product.productDescription" />
    </div>
    <div class="field">
      <label for="category">Category</label>
      <InputText id="category" v-model="product.category" />
    </div>
    <div class="field">
      <label for="prescriptionRequired">Prescription Required</label>
      <InputSwitch v-model="product.prescriptionRequired" />
    </div>
    <div class="field">
      <label for="controlledSubstance">Controlled Substance</label>
      <InputSwitch v-model="product.controlledSubstance" />
    </div>
    <div class="field">
      <label for="sanitaryRegistration">Sanitary Registration</label>
      <InputText id="sanitaryRegistration" v-model="product.sanitaryRegistration" />
    </div>
    <div class="field">
      <label for="reorderLevel">Reorder Level</label>
      <InputNumber id="reorderLevel" v-model="product.reorderLevel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';
import InputNumber from 'primevue/inputnumber';
import { Product } from '../../domain/models/Product';

const props = defineProps<{ product: Product }>();
const emit = defineEmits<{ update: [product: Product] }>();

const product = ref({ ...props.product });

watch(() => props.product, (newVal) => {
  product.value = { ...newVal };
});

watch(product, (newVal) => {
  emit('update', new Product(newVal));
}, { deep: true });
</script>
