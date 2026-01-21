import { prisma } from '../utils/db'
import bcrypt from 'bcryptjs'
import type { Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string; name?: string }>(event)

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name ?? null,
      },
    })

    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    }
  } catch (error) {
    // Ловим ошибку уникальности от Prisma
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw createError({
        statusCode: 409, // Conflict
        statusMessage: 'Email уже используется',
        message: 'Пользователь с таким email уже существует',
      })
    }

    // Другие ошибки (например, валидация или БД)
    console.error('Ошибка создания пользователя:', error)
    throw createError({
      statusCode: 500,
      message: 'Ошибка сервера при регистрации',
    })
  }
})