import { describe, it, expect } from 'vitest'
import { Product } from '../domain/models/Product'

describe('Product', () => {
  it('should create a product instance', () => {
    const product = new Product({
      id: '550e8400-e29b-41d4-a716-446655440000',
      sku: 'SKU001',
      barCode: '123456789',
      productName: 'Test Product',
      productDescription: 'Description',
      category: 'MEDICINE',
      prescriptionRequired: false,
      controlledSubstance: false,
      laboratory: 'Alcos',
      laboratoryId: null,
      brandId: null,
      sanitaryRegistration: 'REG123',
      reorderLevel: 10,
    })

    expect(product.id).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(product.sku).toBe('SKU001')
    expect(product.productName).toBe('Test Product')
  })

  it('should convert product to DTO', () => {
    const product = new Product({
      id: '550e8400-e29b-41d4-a716-446655440000',
      sku: 'SKU001',
      barCode: '123456789',
      productName: 'Test Product',
      productDescription: 'Description',
      category: 'MEDICINE',
      prescriptionRequired: true,
      controlledSubstance: false,
      laboratory: 'Alcos',
      laboratoryId: 'lab1',
      brandId: 'brand1',
      sanitaryRegistration: 'REG123',
      reorderLevel: 10,
    })

    const dto = product.toDTO()

    expect(dto.sku).toBe('SKU001')
    expect(dto.productName).toBe('Test Product')
    expect(dto.prescriptionRequired).toBe(true)
    expect(dto.laboratory).toBe('Alcos')
  })
})
