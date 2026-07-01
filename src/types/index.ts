import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z.string(),
  barCode: z.string(),
  productName: z.string(),
  productDescription: z.string(),
  category: z.string(),
  laboratory: z.string(),
  prescriptionRequired: z.boolean(),
  controlledSubstance: z.boolean(),
  laboratoryId: z.string().nullable().optional(),
  brandId: z.string().nullable(),
  sanitaryRegistration: z.string(),
  reorderLevel: z.number(),
})

export type ProductType = z.infer<typeof ProductSchema>;
