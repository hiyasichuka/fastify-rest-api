import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fjwt from '@fastify/jwt'
import userRoutes from './modules/user/user.route'
import { userSchemas } from './modules/user/user.schema'
import { productShemas } from './modules/product/product.schema'
import productRoutes from './modules/product/product.route'

export const server = Fastify()

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number
      email: string
      name: string
    }
  }
}

server.register(fjwt, {
  secret: 'asdfjp13je9usfjdsalfja9aup'
})

server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (e) {
      return reply.send(e)
    }
  }
)

server.get('/healthcheck', async function (request, response) {
  return { status: 'OK' }
})
async function main() {
  for (const schema of [...userSchemas, ...productShemas]) {
    server.addSchema(schema)
  }

  server.register(userRoutes, { prefix: 'api/users' })
  server.register(productRoutes, { prefix: 'api/products' })

  try {
    await server.listen(3000, '0.0.0.0')
    console.log('Server ready at http://localhost:3000')
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
