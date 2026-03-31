import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductRepository } from '../infrastructure/ProductRepository'
import apiClient from '../../../shared/infrastructure/ApiClient'

vi.mock('../../../shared/infrastructure/ApiClient')
const mockedApiClient = vi.mocked(apiClient)

describe('ProductRepository', () => {
  let repository: ProductRepository

  beforeEach(() => {
    repository = new ProductRepository()
  })

  it('should get all products', async () => {
    const mockResponse = {
      data: {
        content: [
          {
            id: '1',
            sku: 'SKU001',
            barCode: '123',
            productName: 'Product 1',
            productDescription: 'Desc',
            category: 'CAT',
            prescriptionRequired: false,
            controlledSubstance: false,
            laboratoryId: null,
            brandId: null,
            sanitaryRegistration: 'REG',
            reorderLevel: 10,
          },
        ],
        totalElements: 1,
      },
    }
    mockedApiClient.get.mockResolvedValue(mockResponse)

    const result = await repository.getAllProducts({ page: 0, size: 10 })

    expect(result.data).toHaveLength(1)
    expect(result.data[0]?.sku).toBe('SKU001')
    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/products', { params: { page: 0, size: 10 } })
  })

  // Add more tests for other methods
})
