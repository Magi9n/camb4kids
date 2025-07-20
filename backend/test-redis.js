const Redis = require('ioredis');
require('dotenv').config({ path: '../.env' });

async function testRedis() {
  try {
    console.log('Redis config:', {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    });

    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379
    });

    await redis.ping();
    console.log('✅ Redis connection successful');
    await redis.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    process.exit(1);
  }
}

testRedis(); 