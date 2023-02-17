import { hashPassword } from '../../../utils/hash'
import prisma from '../../../utils/prisma'
import { CreatUserInput } from './user.schema'

export async function createUser(input: CreatUserInput) {
  const { password, ...rest } = input
  const { hash, salt } = hashPassword(password)
  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash }
  })
  return user
}
