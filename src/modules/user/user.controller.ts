import { FastifyReply, FastifyRequest } from 'fastify'
import { verifyPassword } from '../../../utils/hash'
import { server } from '../../app'
import { CreatUserInput, LoginInput } from './user.schema'
import { createUser, findUserByEmail, findUsers } from './user.service'

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

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply
) {
  const body = request.body

  // find a user by email
  const user = await findUserByEmail(body.email)

  if (!user) {
    return reply.code(401).send({
      message: 'Inval,id email or password'
    })
  }

  // verify password
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password
  })

  if (correctPassword) {
    const { password, salt, ...rest } = user

    return { accessToken: server.jwt.sign(rest) }
  }

  return reply.code(401).send({
    message: 'Invalid email or password'
  })
  // generate access token

  //
}

export async function getUsersHandler() {
  const users = await findUsers()
  return users
}
