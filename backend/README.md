# Backend - Cambio Mate4Kids

Backend de la plataforma de cambio de divisas desarrollado con NestJS.

## Características

- 🔐 Autenticación JWT con roles
- 💱 Gestión de tasas de cambio en tiempo real
- 📊 Sistema de órdenes con estados
- 👨‍💼 Panel de administración
- 🚀 Rate limiting y seguridad
- 📝 Logging estructurado con Pino
- 🗄️ Base de datos MariaDB con TypeORM
- ⚡ Caché con Redis
- 🧪 Tests unitarios e integración

## Requisitos

- Node.js 18+
- MariaDB/MySQL
- Redis
- API Key de TwelveData

## Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd public_html/backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar base de datos**
```sql
CREATE DATABASE cambio_mate4kids;
```

5. **Ejecutar migraciones**
```bash
npm run migration:run
```

6. **Iniciar en desarrollo**
```bash
npm run start:dev
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `DB_USERNAME` | Usuario de la base de datos | `root` |
| `DB_PASSWORD` | Contraseña de la base de datos | `password` |
| `DB_DATABASE` | Nombre de la base de datos | `cambio_mate4kids` |
| `REDIS_HOST` | Host de Redis | `localhost` |
| `REDIS_PORT` | Puerto de Redis | `6379` |
| `JWT_SECRET` | Clave secreta para JWT | `your-secret-key` |
| `JWT_EXPIRES_IN` | Tiempo de expiración JWT | `24h` |
| `TWELVEDATA_API_KEY` | API Key de TwelveData | `your-api-key` |

## Estructura del Proyecto

```
src/
├── modules/
│   ├── auth/           # Autenticación y autorización
│   ├── rates/          # Gestión de tasas de cambio
│   ├── orders/         # Gestión de órdenes
│   └── admin/          # Panel de administración
├── common/
│   └── dto/            # Data Transfer Objects
├── config/             # Configuraciones
└── main.ts             # Punto de entrada
```

## API Endpoints

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `GET /auth/profile` - Perfil del usuario

### Tasas de Cambio
- `GET /rates/current` - Tasa actual USD/PEN
- `GET /rates/history` - Historial de tasas

### Órdenes
- `POST /orders` - Crear nueva orden
- `GET /orders/history` - Historial de órdenes del usuario
- `GET /orders/:id` - Obtener orden específica
- `POST /orders/:id/status` - Actualizar estado de orden

### Administración
- `GET /admin/settings` - Obtener configuraciones
- `PUT /admin/settings` - Actualizar configuraciones
- `GET /admin/orders` - Listar todas las órdenes
- `PUT /admin/orders/:id` - Actualizar orden (admin)
- `GET /admin/stats` - Estadísticas del sistema

## Estados de Órdenes

- `EN_PROCESO` - Orden creada, pendiente de depósito
- `DEPOSITADO` - Depósito confirmado, pendiente de completar
- `COMPLETADO` - Orden finalizada

## Desarrollo

### Comandos disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Tests
npm run test
npm run test:e2e

# Migraciones
npm run migration:generate
npm run migration:run
npm run migration:revert

# Build
npm run build
```

### Tests

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:e2e

# Cobertura
npm run test:cov
```

## Seguridad

- JWT con expiración configurable
- Rate limiting en endpoints sensibles
- Validación de datos con class-validator
- Helmet para headers de seguridad
- CORS configurado
- Logging estructurado

## Monitoreo

- Logs estructurados con Pino
- Métricas de rendimiento
- Health checks automáticos
- Cron jobs para actualización de tasas

## Docker

```bash
# Construir imagen
docker build -t cambio-backend .

# Ejecutar contenedor
docker run -p 3000:3000 cambio-backend
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. 