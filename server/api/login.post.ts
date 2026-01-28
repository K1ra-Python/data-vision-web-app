import { prisma } from '../utils/db'
import bcrypt from 'bcryptjs'
import type { Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

export default defineEventHandler(async (event) => {
  try {
    // 1️⃣ Получаем данные из формы
    const body = await readBody<{ email: string; password: string }>(event)

    if (!body?.email || !body?.password) {
      throw createError({
        statusCode: 400,
        message: 'Email и пароль обязательны',
      })
    }

    // 2️⃣ Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (!user) {
      // Пользователь не найден
      throw createError({
        statusCode: 401,
        message: 'Неверный email или пароль',
      })
    }

    // 3️⃣ Сравниваем пароль с хэшем в БД
    const isPasswordValid = await bcrypt.compare(body.password, user.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Неверный email или пароль',
      })
    }

    // 4️⃣ Возвращаем данные пользователя (без пароля!)
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  } catch (error: any) {
    // 5️⃣ Логируем и возвращаем ошибки
    console.error('Ошибка авторизации:', error)

    if (error instanceof PrismaClientKnownRequestError) {
      return createError({
        statusCode: 500,
        message: 'Ошибка базы данных',
      })
    }

    // Любые другие ошибки
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка сервера при авторизации',
    })
  }
})
