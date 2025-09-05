import { PrismaClient } from "@prisma/client";

// Global singleton to avoid exhausting DB connections in dev hot-reload
// (Each app imports from @fincy/domains/prisma)
// eslint-disable-next-line no-var
declare global {
	var __FINCY_PRISMA__: PrismaClient | undefined;
}

export const prisma = global.__FINCY_PRISMA__ ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") {
	global.__FINCY_PRISMA__ = prisma;
}

export * from "@prisma/client";
