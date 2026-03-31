<template>
  <div>
    <h2>Inventory Dashboard</h2>
    <Chart type="bar" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Chart from 'primevue/chart'
import { useInventory } from '../../application/useInventory'

const params = reactive({ page: 0, size: 100, sortField: '', sortOrder: 0, filters: {} })
const { products } = useInventory(params)

const chartData = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Reorder Levels',
      backgroundColor: '#42A5F5',
      data: [] as number[],
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
})

onMounted(() => {
  if (products.value) {
    chartData.value.labels = products.value.map((p: any) => p.productName)
    if (chartData.value.datasets[0]) {
      chartData.value.datasets[0].data = products.value.map((p: any) => p.reorderLevel)
    }
  }
})
</script>
