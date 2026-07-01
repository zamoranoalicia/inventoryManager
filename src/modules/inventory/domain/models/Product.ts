import type { ProductType } from '@/types';

export class Product {
  public id: string
  public sku: string
  public barCode: string
  public productName: string
  public productDescription: string
  public category: string
  public laboratory: string
  public prescriptionRequired: boolean
  public controlledSubstance: boolean
  public laboratoryId: string | null
  public brandId: string | null
  public sanitaryRegistration: string
  public reorderLevel: number

  constructor(productData: ProductType) {
    this.id = productData.id || ''
    this.sku = productData.sku
    this.barCode = productData.barCode
    this.productName = productData.productName
    this.productDescription = productData.productDescription
    this.category = productData.category
    this.laboratory = productData.laboratory
    this.prescriptionRequired = productData.prescriptionRequired
    this.controlledSubstance = productData.controlledSubstance
    this.laboratoryId = productData.laboratoryId ?? null
    this.brandId = productData.brandId
    this.sanitaryRegistration = productData.sanitaryRegistration
    this.reorderLevel = productData.reorderLevel
  }

  toDTO() {
    return {
      sku: this.sku,
      barCode: this.barCode,
      productName: this.productName,
      productDescription: this.productDescription,
      category: this.category,
      laboratory: this.laboratory,
      prescriptionRequired: this.prescriptionRequired,
      controlledSubstance: this.controlledSubstance,
      laboratoryId: this.laboratoryId,
      brandId: this.brandId,
      sanitaryRegistration: this.sanitaryRegistration,
      reorderLevel: this.reorderLevel,
    }
  }
}
