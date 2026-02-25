#!/bin/sh
set -e

bunx --bun prisma migrate deploy
exec bun dist/index.js
