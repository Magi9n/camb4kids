const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'cambio_mate4kids',
    });

    console.log('✅ DB connection successful');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection(); 