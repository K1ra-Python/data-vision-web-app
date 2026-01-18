import { prisma } from '../utils/db'
import bcrypt from 'bcryptjs'
import type { Prisma } from '@prisma/client'
export default defineEventHandler(async (event) => {
const body = await readBody<{ name?: string; email: string; password: string }>(event)

const hashedPassword = await bcrypt.hash(body.password, 10)
const user = await prisma.user.create({
  data: {
    name: body.name ?? null,
    email: body.email,
    password: hashedPassword // если планируешь сразу пароль
  },
})


  return user
})