#!/bin/sh
set -e

# Generate Prisma client (already generated in build, but ensures client is up-to-date)
pnpm prisma generate

# Push schema to database
pnpm prisma db push --accept-data-loss

# Start the Next.js server
exec node server.js
