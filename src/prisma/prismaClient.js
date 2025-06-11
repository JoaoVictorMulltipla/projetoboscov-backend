require('dotenv').config({ path: require('path').resolve(__dirname, '../../src/.env') });
console.log('DATABASE_URL:', process.env.DATABASE_URL); // Teste
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;