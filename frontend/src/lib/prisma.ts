import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    // Disable query logging to reduce prepared statement conflicts
    // Add connection management
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
