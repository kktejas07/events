#!/bin/sh
# Don't exit on error - app should start even if db push fails
set +e

# Push schema to database (non-fatal if it fails)
node node_modules/prisma/build/index.js db push --accept-data-loss 2>&1
echo "DB push exit code: $?"

# Start the Next.js server
exec node server.js
