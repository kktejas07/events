#!/bin/sh
set -e

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push --accept-data-loss

# Start the Next.js server
exec node server.js
