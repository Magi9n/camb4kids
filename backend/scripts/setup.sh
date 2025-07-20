#!/bin/bash

echo "🚀 Configurando Backend de Cambio Mate4Kids..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versión 18+ es requerida. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo "⚠️  Por favor edita el archivo .env con tus configuraciones"
else
    echo "✅ Archivo .env ya existe"
fi

# Verificar si las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "❌ Las dependencias no se instalaron correctamente"
    exit 1
fi

echo "✅ Dependencias instaladas correctamente"

# Verificar configuración de TypeORM
echo "🔧 Verificando configuración de TypeORM..."
if [ ! -f "src/config/typeorm.config.ts" ]; then
    echo "❌ Archivo de configuración de TypeORM no encontrado"
    exit 1
fi

echo "✅ Configuración de TypeORM encontrada"

# Verificar si la base de datos está configurada
echo "🗄️  Verificando conexión a la base de datos..."
if ! npm run db:check 2>/dev/null; then
    echo "⚠️  No se pudo conectar a la base de datos"
    echo "   Asegúrate de que:"
    echo "   1. MariaDB/MySQL esté ejecutándose"
    echo "   2. Las credenciales en .env sean correctas"
    echo "   3. La base de datos 'cambio_mate4kids' exista"
else
    echo "✅ Conexión a la base de datos exitosa"
fi

# Verificar Redis
echo "⚡ Verificando conexión a Redis..."
if ! npm run redis:check 2>/dev/null; then
    echo "⚠️  No se pudo conectar a Redis"
    echo "   Asegúrate de que Redis esté ejecutándose"
else
    echo "✅ Conexión a Redis exitosa"
fi

echo ""
echo "🎉 Setup completado!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita el archivo .env con tus configuraciones"
echo "2. Asegúrate de que MariaDB/MySQL esté ejecutándose"
echo "3. Asegúrate de que Redis esté ejecutándose"
echo "4. Ejecuta: npm run migration:run"
echo "5. Ejecuta: npm run start:dev"
echo ""
echo "📚 Para más información, consulta el README.md" 