#!/bin/bash

# SMART Pump Docker Cleanup Script
echo "🧹 Cleaning up SMART Pump Docker environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Stop and remove containers
print_status "Stopping and removing containers..."
docker-compose down

# Remove images
print_status "Removing Docker images..."
docker-compose down --rmi all

# Remove volumes
print_status "Removing volumes..."
docker-compose down -v

# Clean up unused Docker resources
print_status "Cleaning up unused Docker resources..."
docker system prune -f

# Remove specific images if they exist
print_status "Removing SMART Pump images..."
docker images | grep smart-pump | awk '{print $3}' | xargs -r docker rmi -f

print_success "Cleanup completed!"
echo ""
echo "All SMART Pump Docker resources have been removed."
