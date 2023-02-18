import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const productInputSchema = {
  title: z.string(),
  price: z.number(),
  content: z.string().optional()
}
const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string()
}
const createProductSchema = z.object({ ...productInputSchema })

const productResponseSchema = z.object({
  ...productInputSchema,
  ...productGenerated
})

const productsResponseSchema = z.array(productResponseSchema)

export type CreatProductInput = z.infer<typeof createProductSchema>

export const { schemas: productShemas, $ref } = buildJsonSchemas({
  createProductSchema,
  productResponseSchema,
  productsResponseSchema
})
