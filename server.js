require('dotenv').config();
const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Optional: test Prisma DB connection
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to Prisma DB');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
    
  } catch (err) {
    console.error('❌ Failed to connect DB:', err.message);
  }
}

startServer();
