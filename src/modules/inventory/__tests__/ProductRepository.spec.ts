import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductRepository } from '../infrastructure/ProductRepository'
import { Product } from '../domain/models/Product'
import apiClient from '../../../shared/infrastructure/ApiClient'

vi.mock('../../../shared/infrastructure/ApiClient')
const mockedApiClient = vi.mocked(apiClient)

const mockProductData = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  sku: 'SKU001',
  barCode: '123456789',
  productName: 'Test Product',
  productDescription: 'Test Description',
  category: 'MEDICINE',
  prescriptionRequired: false,
  controlledSubstance: false,
  laboratoryId: null,
  brandId: null,
  sanitaryRegistration: 'REG123',
  reorderLevel: 10,
}

describe('ProductRepository', () => {
  let repository: ProductRepository

  beforeEach(() => {
    repository = new ProductRepository()
    vi.clearAllMocks()
  })

  it('should get all products with pagination', async () => {
    const mockResponse = {
      data: {
        content: [mockProductData],
        totalElements: 1,
      },
    }
    mockedApiClient.get.mockResolvedValue(mockResponse)

    const result = await repository.getAllProducts({ page: 0, size: 10 })

    expect(result.data).toHaveLength(1)
    expect(result.data[0]?.sku).toBe('SKU001')
    expect(result.total).toBe(1)
  })

  it('should get product by id', async () => {
    mockedApiClient.get.mockResolvedValue({ data: mockProductData })

    const result = await repository.getProductById('550e8400-e29b-41d4-a716-446655440000')

    expect(result.id).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(result.sku).toBe('SKU001')
  })

  it('should create a product', async () => {
    const newProduct = new Product({
      id: '',
      sku: 'SKU002',
      barCode: '987654321',
      productName: 'New Product',
      productDescription: 'New Description',
      category: 'SUPPLEMENT',
      prescriptionRequired: false,
      controlledSubstance: false,
      laboratoryId: null,
      brandId: null,
      sanitaryRegistration: 'REG456',
      reorderLevel: 5,
    })

    mockedApiClient.post.mockResolvedValue({ data: { ...mockProductData, id: '550e8400-e29b-41d4-a716-446655440001' } })

    const result = await repository.createProduct(newProduct)

    expect(result.id).toBeDefined()
    expect(mockedApiClient.post).toHaveBeenCalledWith('http://localhost:8080/api/products', expect.any(Object))
  })

  it('should delete a product', async () => {
    mockedApiClient.delete.mockResolvedValue({ data: {} })

    await repository.deleteProduct('550e8400-e29b-41d4-a716-446655440000')

    expect(mockedApiClient.delete).toHaveBeenCalledWith('http://localhost:8080/api/products/550e8400-e29b-41d4-a716-446655440000')
  })
})
