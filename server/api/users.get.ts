import { prisma } from '../utils/db'

import type { Prisma } from '@prisma/client'

export default defineEventHandler(async () => {
  const args: Prisma.UserFindManyArgs = {
    include: { datasets: true,
      templates: true
     },
    
  }

  const users = await prisma.user.findMany(args)
  return users
})