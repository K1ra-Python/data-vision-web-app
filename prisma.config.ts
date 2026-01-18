// prisma.config.ts — в корне проекта (рядом с package.json!)
import 'dotenv/config'           // ← это обязательно, чтобы .env подгружался
import { defineConfig, env } from '@prisma/config'  // или 'prisma/config' — иногда так

export default defineConfig({
  schema: 'prisma/schema.prisma',  // путь от корня проекта
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),      // ← только имя переменной!
  },
})