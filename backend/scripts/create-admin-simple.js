const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');
const { config } = require('dotenv');

// Cargar variables de entorno
config();

async function createAdmin() {
  console.log('Iniciando script para crear usuario administrador...');
  
  // Configuración de la base de datos
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/modules/**/entities/*.entity.js'],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    // Obtener el repositorio de usuarios
    const userRepository = dataSource.getRepository('User');
    
    // Verificar si ya existe un admin
    const existingAdmin = await userRepository.findOne({ 
      where: { email: 'admin@mate4kids.com' } 
    });
    
    if (existingAdmin) {
      console.log('✅ Usuario administrador ya existe');
      console.log('Email: admin@mate4kids.com');
      console.log('Contraseña: admin123');
      await dataSource.destroy();
      return;
    }
    
    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Crear usuario administrador
    const adminUser = userRepository.create({
      email: 'admin@mate4kids.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin'
    });
    
    await userRepository.save(adminUser);
    
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('Email: admin@mate4kids.com');
    console.log('Contraseña: admin123');
    console.log('Role: admin');
    
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

createAdmin(); 
const bcrypt = require('bcrypt');
const { config } = require('dotenv');

// Cargar variables de entorno
config();

async function createAdmin() {
  console.log('Iniciando script para crear usuario administrador...');
  
  // Configuración de la base de datos
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/modules/**/entities/*.entity.js'],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    // Obtener el repositorio de usuarios
    const userRepository = dataSource.getRepository('User');
    
    // Verificar si ya existe un admin
    const existingAdmin = await userRepository.findOne({ 
      where: { email: 'admin@mate4kids.com' } 
    });
    
    if (existingAdmin) {
      console.log('✅ Usuario administrador ya existe');
      console.log('Email: admin@mate4kids.com');
      console.log('Contraseña: admin123');
      await dataSource.destroy();
      return;
    }
    
    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Crear usuario administrador
    const adminUser = userRepository.create({
      email: 'admin@mate4kids.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin'
    });
    
    await userRepository.save(adminUser);
    
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('Email: admin@mate4kids.com');
    console.log('Contraseña: admin123');
    console.log('Role: admin');
    
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

createAdmin(); 