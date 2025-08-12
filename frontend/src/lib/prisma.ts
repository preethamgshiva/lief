import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Create PrismaClient only when needed (runtime)
const createPrismaClient = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set')
    }
    
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    })
}

// Lazy initialization - only create client when first accessed
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
