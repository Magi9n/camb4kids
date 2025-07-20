const { config } = require('dotenv');
const path = require('path');

// Cargar .env desde el directorio padre (public_html)
config({ path: path.join(__dirname, '../.env') });

console.log('Variables de entorno:');
console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('REDIS_PORT:', process.env.REDIS_PORT);
console.log('REDIS_PORT (number):', Number(process.env.REDIS_PORT));
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT); 