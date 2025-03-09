const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client (reads DATABASE_URL from .env)
const prisma = new PrismaClient();

module.exports = prisma;
