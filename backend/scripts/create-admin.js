const { NestFactory } = require('@nestjs/core');
const { ConfigService } = require('@nestjs/config');
const bcrypt = require('bcrypt');

async function createAdmin() {
  console.log('Iniciando script para crear usuario administrador...');
  
  try {
    // Importar dinámicamente el AppModule
    const { AppModule } = await import('../dist/app.module.js');
    
    const app = await NestFactory.createApplicationContext(AppModule);
    const configService = app.get(ConfigService);
    
    // Obtener el repositorio de usuarios
    const { getRepository } = require('typeorm');
    const { User } = require('../dist/modules/auth/entities/user.entity.js');
    const userRepository = getRepository(User);
    
    // Verificar si ya existe un admin
    const existingAdmin = await userRepository.findOne({ where: { email: 'admin@mate4kids.com' } });
    
    if (existingAdmin) {
      console.log('✅ Usuario administrador ya existe');
      console.log('Email: admin@mate4kids.com');
      console.log('Contraseña: admin123');
      await app.close();
      return;
    }
    
    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Crear usuario administrador
    const adminUser = userRepository.create({
      email: 'admin@mate4kids.com',
      password: hashedPassword,
      nombre: 'Administrador',
      role: 'admin'
    });
    
    await userRepository.save(adminUser);
    
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('Email: admin@mate4kids.com');
    console.log('Contraseña: admin123');
    console.log('Role: admin');
    
    await app.close();
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    process.exit(1);
  }
}

createAdmin(); 
const { ConfigService } = require('@nestjs/config');
const bcrypt = require('bcrypt');

async function createAdmin() {
  console.log('Iniciando script para crear usuario administrador...');
  
  try {
    // Importar dinámicamente el AppModule
    const { AppModule } = await import('../dist/app.module.js');
    
    const app = await NestFactory.createApplicationContext(AppModule);
    const configService = app.get(ConfigService);
    
    // Obtener el repositorio de usuarios
    const { getRepository } = require('typeorm');
    const { User } = require('../dist/modules/auth/entities/user.entity.js');
    const userRepository = getRepository(User);
    
    // Verificar si ya existe un admin
    const existingAdmin = await userRepository.findOne({ where: { email: 'admin@mate4kids.com' } });
    
    if (existingAdmin) {
      console.log('✅ Usuario administrador ya existe');
      console.log('Email: admin@mate4kids.com');
      console.log('Contraseña: admin123');
      await app.close();
      return;
    }
    
    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Crear usuario administrador
    const adminUser = userRepository.create({
      email: 'admin@mate4kids.com',
      password: hashedPassword,
      nombre: 'Administrador',
      role: 'admin'
    });
    
    await userRepository.save(adminUser);
    
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('Email: admin@mate4kids.com');
    console.log('Contraseña: admin123');
    console.log('Role: admin');
    
    await app.close();
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    process.exit(1);
  }
}

createAdmin(); 
 
 