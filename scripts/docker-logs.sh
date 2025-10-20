#!/bin/bash

# SMART Pump Docker Logs Script
echo "📋 Viewing SMART Pump Docker Logs..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if service name is provided
if [ $# -eq 0 ]; then
    print_status "Showing logs for all services..."
    docker-compose logs -f
else
    print_status "Showing logs for service: $1"
    docker-compose logs -f $1
fi
