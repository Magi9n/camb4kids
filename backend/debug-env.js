const { config } = require('dotenv');
const path = require('path');

console.log('Directorio actual:', __dirname);
console.log('Ruta del .env:', path.join(__dirname, '../.env'));

// Cargar .env desde el directorio padre (public_html)
config({ path: path.join(__dirname, '../.env') });

console.log('\nVariables de entorno después de cargar .env:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('REDIS_PORT:', process.env.REDIS_PORT);
console.log('REDIS_PORT (number):', Number(process.env.REDIS_PORT));
console.log('TWELVEDATA_API_URL:', process.env.TWELVEDATA_API_URL);
console.log('TWELVEDATA_API_KEY:', process.env.TWELVEDATA_API_KEY ? '***' : 'undefined'); 