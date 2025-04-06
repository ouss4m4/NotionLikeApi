import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const connectPrisma = () => {
  try {
    const client = global.prisma ?? prismaClientSingleton();

    // client.$on("error", (e) => {
    //   console.error("Prisma Client error:", e);
    // });

    return client;
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    throw error;
  }
};

const prisma = connectPrisma();
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };
