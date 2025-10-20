#!/bin/bash

# SMART Pump Docker Setup Script
echo "🚀 Setting up SMART Pump with Docker..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p data

# Copy environment files if they don't exist
if [ ! -f api/.env ]; then
    print_status "Creating API environment file..."
    cat > api/.env << EOF
PORT=3001
JWT_SECRET=smart-pump-super-secret-jwt-key-2024-docker
NODE_ENV=production
DB_PATH=./data/database.json
LOG_LEVEL=info
FRONTEND_URL=http://localhost:5173
EOF
fi

if [ ! -f client/.env ]; then
    print_status "Creating client environment file..."
    cat > client/.env << EOF
VITE_API_URL=http://localhost:3001/api
EOF
fi

# Build and start services
print_status "Building Docker images..."
docker-compose build

if [ $? -eq 0 ]; then
    print_success "Docker images built successfully!"
else
    print_error "Failed to build Docker images"
    exit 1
fi

# Run database migration
print_status "Running database migration..."
docker-compose run --rm migrate

if [ $? -eq 0 ]; then
    print_success "Database migration completed!"
else
    print_warning "Database migration failed, but continuing..."
fi

# Start services
print_status "Starting services..."
docker-compose up -d

if [ $? -eq 0 ]; then
    print_success "Services started successfully!"
else
    print_error "Failed to start services"
    exit 1
fi

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Check service health
print_status "Checking service health..."

# Check API health
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_success "API is healthy!"
else
    print_warning "API health check failed"
fi

# Check client health
if curl -f http://localhost:80 > /dev/null 2>&1; then
    print_success "Client is healthy!"
else
    print_warning "Client health check failed"
fi

echo ""
print_success "🎉 SMART Pump is now running with Docker!"
echo ""
echo "📱 Frontend: http://localhost:80"
echo "🔧 Backend API: http://localhost:3001"
echo "📊 API Health: http://localhost:3001/health"
echo ""
echo "📋 Demo Credentials:"
echo "   Email: henderson.briggs@geeknet.net"
echo "   Password: 23derd*334"
echo ""
echo "🛠️  Useful Commands:"
echo "   docker-compose logs -f          # View logs"
echo "   docker-compose ps               # Check status"
echo "   docker-compose down             # Stop services"
echo "   docker-compose restart          # Restart services"
echo ""
