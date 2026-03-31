import { z } from 'zod'
import apiClient from '../../../shared/infrastructure/ApiClient'
import { Product } from '../domain/models/Product'
import { ProductSchema } from '@/types'

export class ProductRepository {
  private baseUrl = 'http://localhost:8080/api/products';  // Adjust if needed

  async getAllProducts(params: {
    page: number
    size: number
    sortField?: string
    sortOrder?: number
    filters?: Record<string, any>
  }): Promise<{ data: Product[]; total: number }> {
    const response = await apiClient.get(this.baseUrl, { params })
    const validatedData = z.array(ProductSchema).parse(response.data.content || response.data)
    return {
      data: validatedData.map(dto => new Product(dto)),
      total: response.data.totalElements || validatedData.length,
    }
  }

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`)
    const validatedData = ProductSchema.parse(response.data)
    return new Product(validatedData)
  }

  async getProductBySku(sku: string): Promise<Product> {
    const response = await apiClient.get(`${this.baseUrl}/sku/${sku}`)
    const validatedData = ProductSchema.parse(response.data)
    return new Product(validatedData)
  }

  async createProduct(product: Product): Promise<Product> {
    const response = await apiClient.post(this.baseUrl, product.toDTO())
    const validatedData = ProductSchema.parse(response.data)
    return new Product(validatedData)
  }

  async updateProduct(id: string, productData: Product): Promise<Product> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, productData.toDTO())
    const validatedData = ProductSchema.parse(response.data)
    return new Product(validatedData)
  }

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`)
  }
}
