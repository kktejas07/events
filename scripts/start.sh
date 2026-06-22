#!/bin/sh
set -e

# Push schema to database (using prisma CLI directly)
node node_modules/prisma/build/index.js db push --accept-data-loss

# Start the Next.js server
exec node server.js
