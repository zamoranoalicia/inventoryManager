import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInventory } from '../application/useInventory'
import { useQuery, useMutation } from '@tanstack/vue-query'

vi.mock('@tanstack/vue-query')
vi.mock('../infrastructure/ProductRepository')

const mockedUseQuery = vi.mocked(useQuery)
const mockedUseMutation = vi.mocked(useMutation)

describe('useInventory Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default parameters', () => {
    mockedUseQuery.mockReturnValue({
      data: { value: { data: [], total: 0 } },
      isLoading: { value: false },
      error: { value: null },
      refetch: vi.fn(),
      status: { value: 'success' },
    } as any)

    mockedUseMutation.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      data: { value: null },
      isPending: { value: false },
      error: { value: null },
      status: { value: 'idle' },
    } as any)

    const params = {
      page: 0,
      size: 10,
      sortField: '',
      sortOrder: 0,
      filters: {},
    }

    const { products, total, isLoading } = useInventory(params)

    expect(products).toBeDefined()
    expect(total).toBeDefined()
    expect(isLoading).toBeDefined()
  })

  it('should provide CRUD mutations', () => {
    mockedUseQuery.mockReturnValue({
      data: { value: { data: [], total: 0 } },
      isLoading: { value: false },
      error: { value: null },
      refetch: vi.fn(),
      status: { value: 'success' },
    } as any)

    mockedUseMutation.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      data: { value: null },
      isPending: { value: false },
      error: { value: null },
      status: { value: 'idle' },
    } as any)

    const params = {
      page: 0,
      size: 10,
      sortField: '',
      sortOrder: 0,
      filters: {},
    }

    const { createProduct, updateProduct, deleteProduct } = useInventory(params)

    expect(createProduct).toBeDefined()
    expect(updateProduct).toBeDefined()
    expect(deleteProduct).toBeDefined()
    expect(mockedUseMutation).toHaveBeenCalled()
  })
})
