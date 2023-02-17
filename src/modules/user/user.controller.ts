import { FastifyReply, FastifyRequest } from 'fastify'
import { CreatUserInput } from './user.schema'
import { createUser } from './user.service'

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreatUserInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  try {
    const user = await createUser(body)
    return reply.code(201).send(user)
  } catch (e) {
    console.error(e)
    return reply.code(500).send(e)
  }
}
