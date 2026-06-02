import type { Component } from 'vue'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
} from '@lucide/vue'
import labels from '@/modules/inventory/labels'

export type SectionId = 'dashboard' | 'inventory' | 'orders' | 'customers' | 'reports' | 'settings'

export interface NavItem {
  id: SectionId
  label: string
  icon: Component
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: labels.sectionDashboard, icon: LayoutDashboard },
  { id: 'inventory', label: labels.sectionInventory, icon: Package },
  { id: 'orders', label: labels.sectionOrders, icon: ShoppingCart },
  { id: 'customers', label: labels.sectionCustomers, icon: Users },
  { id: 'reports', label: labels.sectionReports, icon: BarChart2 },
  { id: 'settings', label: labels.sectionSettings, icon: Settings },
]

export const SECTION_LABELS: Record<SectionId, string> = {
  dashboard: labels.sectionDashboard,
  inventory: labels.sectionInventory,
  orders: labels.sectionOrders,
  customers: labels.sectionCustomers,
  reports: labels.sectionReports,
  settings: labels.sectionSettings,
}
