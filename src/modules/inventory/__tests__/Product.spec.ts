import { describe, it, expect } from 'vitest'
import { Product } from '../domain/models/Product'

describe('Product', () => {
  it('should create a product instance', () => {
    const product = new Product(
      '1',
      'SKU001',
      '123456789',
      'Test Product',
      'Description',
      'CATEGORY',
      false,
      false,
      null,
      null,
      'REG123',
      10
    )

    expect(product.id).toBe('1')
    expect(product.sku).toBe('SKU001')
    expect(product.productName).toBe('Test Product')
  })
})
