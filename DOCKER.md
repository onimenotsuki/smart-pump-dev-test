# SMART Pump Docker Implementation

Esta documentación describe cómo ejecutar el proyecto SMART Pump usando Docker y Docker Compose.

## 🐳 Arquitectura Docker

### Servicios

1. **API Backend** (`smart-pump-api`)
   - Express.js + TypeScript
   - Puerto: 3001
   - Base de datos: LowDB (JSON)
   - Autenticación: JWT

2. **Frontend Client** (`smart-pump-client`)
   - React + Vite + TypeScript
   - Puerto: 8000 (Nginx)
   - Build optimizado para producción

3. **Database Migration** (`smart-pump-migrate`)
   - Migración de datos inicial
   - Ejecuta una sola vez al inicio

## 🚀 Inicio Rápido

### Opción 1: Script Automatizado (Recomendado)

```bash
# Ejecutar setup completo
./scripts/docker-setup.sh
```

### Opción 2: Comandos Manuales

```bash
# Construir imágenes
docker-compose build

# Ejecutar migración de base de datos
docker-compose run --rm migrate

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

## 🛠️ Comandos Útiles

### Gestión de Servicios

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver estado de servicios
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api
docker-compose logs -f client
```

### Desarrollo

```bash
# Modo desarrollo (con hot reload)
./scripts/docker-dev.sh

# O manualmente:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Limpieza

```bash
# Limpiar todo el entorno Docker
./scripts/docker-clean.sh

# O manualmente:
docker-compose down --rmi all -v
docker system prune -f
```

## 📁 Estructura de Archivos Docker

```
smart-pump-full-stack/
├── Dockerfile.api              # Backend API
├── Dockerfile.client           # Frontend Client
├── docker-compose.yml          # Producción
├── docker-compose.dev.yml      # Desarrollo
├── docker-compose.override.yml  # Overrides locales
├── nginx.conf                  # Configuración Nginx
├── .dockerignore              # Archivos a ignorar
└── scripts/
    ├── docker-setup.sh        # Setup automático
    ├── docker-dev.sh          # Modo desarrollo
    ├── docker-logs.sh         # Ver logs
    └── docker-clean.sh        # Limpieza
```

## 🌐 Acceso a la Aplicación

### Producción

- **Frontend:** http://localhost:8000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

### Desarrollo

- **Frontend:** http://localhost:8000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 🔐 Credenciales de Demo

```
Email: henderson.briggs@geeknet.net
Password: 23derd*334
```

## 📊 Monitoreo y Logs

### Health Checks

```bash
# Verificar estado de servicios
docker-compose ps

# Health check manual
curl http://localhost:3001/health
curl http://localhost:8000
```

### Logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo API
docker-compose logs -f api

# Solo Client
docker-compose logs -f client

# Últimas 100 líneas
docker-compose logs --tail=100 -f
```

## 🔧 Configuración

### Variables de Entorno

#### Backend (API)

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=smart-pump-super-secret-jwt-key-2024-docker
DB_PATH=./data/database.json
LOG_LEVEL=info
FRONTEND_URL=http://localhost:8000
```

#### Frontend (Client)

```env
VITE_API_URL=http://localhost:3001/api
```

### Volúmenes

- `api_data`: Datos de la base de datos
- `api_logs`: Logs del backend

### Redes

- `smart-pump-network`: Red interna para comunicación entre servicios

## 🐛 Troubleshooting

### Problemas Comunes

1. **Puerto ya en uso**

   ```bash
   # Verificar qué está usando el puerto
   lsof -i :3001
   lsof -i :8000

   # Cambiar puertos en docker-compose.yml
   ```

2. **Servicios no inician**

   ```bash
   # Ver logs detallados
   docker-compose logs api
   docker-compose logs client

   # Reconstruir imágenes
   docker-compose build --no-cache
   ```

3. **Base de datos no migra**

   ```bash
   # Ejecutar migración manualmente
   docker-compose run --rm migrate
   ```

4. **Frontend no carga**

   ```bash
   # Verificar que el build fue exitoso
   docker-compose logs client

   # Reconstruir solo el cliente
   docker-compose build client
   ```

### Comandos de Diagnóstico

```bash
# Estado de contenedores
docker-compose ps

# Uso de recursos
docker stats

# Inspeccionar contenedor
docker-compose exec api sh
docker-compose exec client sh

# Ver archivos dentro del contenedor
docker-compose exec api ls -la /app
docker-compose exec client ls -la /usr/share/nginx/html
```

## 🔄 Actualizaciones

### Actualizar Código

```bash
# Detener servicios
docker-compose down

# Reconstruir con cambios
docker-compose build --no-cache

# Iniciar servicios
docker-compose up -d
```

### Actualizar Base de Datos

```bash
# Ejecutar migración
docker-compose run --rm migrate

# O reiniciar servicios (migración automática)
docker-compose restart
```

## 📈 Producción

### Optimizaciones

1. **Multi-stage builds** para imágenes más pequeñas
2. **Health checks** para monitoreo
3. **Volúmenes persistentes** para datos
4. **Nginx** para servir frontend estático
5. **Logs centralizados** para debugging

### Escalabilidad

```bash
# Escalar servicios (si es necesario)
docker-compose up -d --scale api=2
```

### Backup

```bash
# Backup de datos
docker-compose exec api tar -czf /tmp/backup.tar.gz /app/data
docker cp smart-pump-api:/tmp/backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz
```

## 🚀 Deployment

### Docker Swarm (Opcional)

```bash
# Inicializar swarm
docker swarm init

# Desplegar stack
docker stack deploy -c docker-compose.yml smart-pump
```

### Kubernetes (Opcional)

Los archivos Docker pueden ser adaptados para Kubernetes usando herramientas como `kompose`.

## 📚 Recursos Adicionales

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
