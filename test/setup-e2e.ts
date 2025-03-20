import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { DomainEvents } from "@/core/events/domain-events";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseUrl;

  DomainEvents.shouldRun = false;

  const result = execSync("pnpm prisma migrate deploy");

  console.log(result.toString());
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`
  );

  await prisma.$disconnect();
});
