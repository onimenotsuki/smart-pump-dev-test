#!/bin/bash

# SMART Pump Docker Development Script
echo "🚀 Starting SMART Pump in Development Mode..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Start development services
print_status "Starting development services..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

print_success "Development services started!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3001"
echo "📊 API Health: http://localhost:3001/health"
