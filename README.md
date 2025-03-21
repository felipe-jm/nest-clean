# Forum Clean DDD Architecture API

## Setup

```bash
pnpm install
```

## Run Postgres and Redis

```bash
docker compose up -d
```

## Run Prisma Migration

```bash
pnpm prisma migrate dev
```

## Run tests

```bash
pnpm test
```

## Run E2E tests

```bash
pnpm test:e2e
```

## Run Prisma Studio

```bash
pnpm prisma studio
```

## Run server

```bash
pnpm start:dev
```
