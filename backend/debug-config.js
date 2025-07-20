const { NestFactory } = require('@nestjs/core');
const { ConfigService } = require('@nestjs/config');
const { join } = require('path');

async function debugConfig() {
  console.log('Iniciando aplicación NestJS para depurar ConfigService...');
  
  // Importar dinámicamente el AppModule
  const { AppModule } = await import('./dist/app.module.js');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  
  console.log('\nVariables de entorno desde ConfigService:');
  console.log('DB_HOST:', configService.get('DB_HOST'));
  console.log('DB_PORT:', configService.get('DB_PORT'));
  console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
  console.log('DB_PASSWORD:', configService.get('DB_PASSWORD') ? '***' : 'undefined');
  console.log('DB_DATABASE:', configService.get('DB_DATABASE'));
  console.log('REDIS_HOST:', configService.get('REDIS_HOST'));
  console.log('REDIS_PORT:', configService.get('REDIS_PORT'));
  console.log('REDIS_PORT (number):', parseInt(configService.get('REDIS_PORT')));
  console.log('TWELVEDATA_API_URL:', configService.get('TWELVEDATA_API_URL'));
  console.log('TWELVEDATA_API_KEY:', configService.get('TWELVEDATA_API_KEY') ? '***' : 'undefined');
  
  await app.close();
}

debugConfig().catch(console.error); 