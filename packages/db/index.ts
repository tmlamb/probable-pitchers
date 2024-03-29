import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? [
          //"debug",
          "info",
          "warn",
          "error",
        ]
      : ["info", "warn", "error"],
});

export * from "@prisma/client";
