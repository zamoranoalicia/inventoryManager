import labels from '@/modules/inventory/labels'
import type { Product } from '@/modules/inventory/domain/models/Product'

/**
 * UI-only stock/status helpers.
 *
 * The backend `Product` model has no `stock` or `status` field yet, so this is a
 * presentation-layer placeholder: products render as `active` and stock shows as `—`.
 * The derivation is written to be future-proof — once the API exposes a real numeric
 * stock, pass it in (or add `stock` to `Product`) and the active/low/out logic below
 * starts working with no UI changes.
 */

export type StockStatus = 'active' | 'low' | 'out'

export interface StatusConfig {
  key: StockStatus
  label: string
  /** Tailwind classes for the rounded status badge (matches the Figma palette). */
  badgeClass: string
  /** Text color used when rendering the stock number. */
  textClass: string
}

const STATUS_CONFIG: Record<StockStatus, StatusConfig> = {
  active: {
    key: 'active',
    label: labels.statusActive,
    badgeClass: 'bg-emerald-50 text-emerald-700',
    textClass: 'text-foreground',
  },
  low: {
    key: 'low',
    label: labels.statusLow,
    badgeClass: 'bg-amber-50 text-amber-700',
    textClass: 'text-amber-600',
  },
  out: {
    key: 'out',
    label: labels.statusOut,
    badgeClass: 'bg-red-50 text-red-700',
    textClass: 'text-red-600',
  },
}

/** Returns the current stock for a product, or `null` when it is unknown (no backend field). */
export function getStock(product: Product): number | null {
  const stock = (product as Product & { stock?: number }).stock
  return typeof stock === 'number' ? stock : null
}

/** Derives the display status. Defaults to `active` while stock data is unavailable. */
export function deriveStatus(product: Product): StockStatus {
  const stock = getStock(product)
  if (stock === null) return 'active'
  if (stock <= 0) return 'out'
  if (product.reorderLevel > 0 && stock <= product.reorderLevel) return 'low'
  return 'active'
}

export function statusConfig(product: Product): StatusConfig {
  return STATUS_CONFIG[deriveStatus(product)]
}

/** Whether the stock is at/below the reorder level (shows the trending-down icon). */
export function isLowStock(product: Product): boolean {
  const stock = getStock(product)
  if (stock === null) return false
  return product.reorderLevel > 0 && stock <= product.reorderLevel && stock > 0
}

/** Stock value formatted for display; `—` when unknown. */
export function stockDisplay(product: Product): string {
  const stock = getStock(product)
  return stock === null ? '—' : String(stock)
}
