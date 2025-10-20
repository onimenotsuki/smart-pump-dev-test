# SMART Pump Docker Implementation

This documentation describes how to run the SMART Pump project using Docker and Docker Compose.

## 🐳 Docker Architecture

### Services

1. **API Backend** (`smart-pump-api`)
   - Express.js + TypeScript
   - Port: 3001
   - Database: LowDB (JSON)
   - Authentication: JWT

2. **Frontend Client** (`smart-pump-client`)
   - React + Vite + TypeScript
   - Port: 8000 (Nginx)
   - Production-optimized build

3. **Database Migration** (`smart-pump-migrate`)
   - Initial data migration
   - Runs once at startup

## 🚀 Quick Start

### Option 1: Automated Script (Recommended)

```bash
# Run complete setup
./scripts/docker-setup.sh
```

### Option 2: Manual Commands

```bash
# Build images
docker-compose build

# Run database migration
docker-compose run --rm migrate

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🛠️ Useful Commands

### Service Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View service status
docker-compose ps

# View logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f api
docker-compose logs -f client
```

### Development

```bash
# Development mode (with hot reload)
./scripts/docker-dev.sh

# Or manually:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Cleanup

```bash
# Clean entire Docker environment
./scripts/docker-clean.sh

# Or manually:
docker-compose down --rmi all -v
docker system prune -f
```

## 📁 Docker File Structure

```
smart-pump-full-stack/
├── Dockerfile.api              # Backend API
├── Dockerfile.client           # Frontend Client
├── docker-compose.yml          # Production
├── docker-compose.dev.yml      # Development
├── docker-compose.override.yml  # Local overrides
├── nginx.conf                  # Nginx configuration
├── .dockerignore              # Files to ignore
└── scripts/
    ├── docker-setup.sh        # Automated setup
    ├── docker-dev.sh          # Development mode
    ├── docker-logs.sh         # View logs
    └── docker-clean.sh        # Cleanup
```

## 🌐 Application Access

### Production

- **Frontend:** http://localhost:8000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

### Development

- **Frontend:** http://localhost:8000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 🔐 Demo Credentials

```
Email: henderson.briggs@geeknet.net
Password: 23derd*334
```

## 📊 Monitoring and Logs

### Health Checks

```bash
# Check service status
docker-compose ps

# Manual health check
curl http://localhost:3001/health
curl http://localhost:8000
```

### Logs

```bash
# All services
docker-compose logs -f

# API only
docker-compose logs -f api

# Client only
docker-compose logs -f client

# Last 100 lines
docker-compose logs --tail=100 -f
```

## 🔧 Configuration

### Environment Variables

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

### Volumes

- `api_data`: Database data
- `api_logs`: Backend logs

### Networks

- `smart-pump-network`: Internal network for inter-service communication

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Check what's using the port
   lsof -i :3001
   lsof -i :8000

   # Change ports in docker-compose.yml
   ```

2. **Services won't start**

   ```bash
   # View detailed logs
   docker-compose logs api
   docker-compose logs client

   # Rebuild images
   docker-compose build --no-cache
   ```

3. **Database won't migrate**

   ```bash
   # Run migration manually
   docker-compose run --rm migrate
   ```

4. **Frontend won't load**

   ```bash
   # Verify the build was successful
   docker-compose logs client

   # Rebuild client only
   docker-compose build client
   ```

### Diagnostic Commands

```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# Inspect container
docker-compose exec api sh
docker-compose exec client sh

# View files inside container
docker-compose exec api ls -la /app
docker-compose exec client ls -la /usr/share/nginx/html
```

## 🔄 Updates

### Update Code

```bash
# Stop services
docker-compose down

# Rebuild with changes
docker-compose build --no-cache

# Start services
docker-compose up -d
```

### Update Database

```bash
# Run migration
docker-compose run --rm migrate

# Or restart services (automatic migration)
docker-compose restart
```

## 📈 Production

### Optimizations

1. **Multi-stage builds** for smaller images
2. **Health checks** for monitoring
3. **Persistent volumes** for data
4. **Nginx** for serving static frontend
5. **Centralized logs** for debugging

### Scalability

```bash
# Scale services (if needed)
docker-compose up -d --scale api=2
```

### Backup

```bash
# Data backup
docker-compose exec api tar -czf /tmp/backup.tar.gz /app/data
docker cp smart-pump-api:/tmp/backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz
```

## 🚀 Deployment

### Docker Swarm (Optional)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml smart-pump
```

### Kubernetes (Optional)

Docker files can be adapted for Kubernetes using tools like `kompose`.

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---
