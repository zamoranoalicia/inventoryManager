import { describe, it, expect, vi } from 'vitest'
import { useProductsQuery, useCreateProductMutation } from '../application/useInventory'
import { vi as vitest } from 'vitest'

// Mock TanStack Query
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn((options) => {
    return {
      data: {
        value: {
          data: [],
          total: 0,
        },
      },
      isLoading: { value: false },
      error: { value: null },
    }
  }),
  useMutation: vi.fn(() => {
    return {
      mutate: vi.fn(),
      data: { value: null },
      isPending: { value: false },
      error: { value: null },
    }
  }),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}))

describe('useInventory Composables', () => {
  it('should provide useProductsQuery hook', () => {
    expect(useProductsQuery).toBeDefined()
  })

  it('should provide useCreateProductMutation hook', () => {
    expect(useCreateProductMutation).toBeDefined()
  })
})
