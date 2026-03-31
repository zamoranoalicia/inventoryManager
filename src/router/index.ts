import { createRouter, createWebHistory } from 'vue-router'
import InventoryPage from '../modules/inventory/presentation/InventoryPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/inventory',
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: InventoryPage,
    },
  ],
})

export default router
