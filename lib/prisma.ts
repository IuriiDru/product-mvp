import { PrismaClient } from "@prisma/client";

// Singleton, чтобы при hot-reload в dev не плодить подключения.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
