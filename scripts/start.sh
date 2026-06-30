#!/bin/sh
set +e

mkdir -p /app/public/uploads

node node_modules/prisma/build/index.js db push --accept-data-loss 2>&1
echo "DB push exit code: $?"

exec node server.js
