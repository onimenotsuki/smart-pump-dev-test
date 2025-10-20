# SMART Pump Docker Makefile
# Simplifies Docker operations with easy-to-remember commands

.PHONY: help build up down restart logs clean dev setup status health

# Default target
help: ## Show this help message
	@echo "SMART Pump Docker Commands"
	@echo "=========================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Quick Start:"
	@echo "  make setup    # Complete setup and start"
	@echo "  make dev      # Development mode"
	@echo "  make logs     # View logs"
	@echo "  make clean    # Clean everything"

# Setup and start all services
setup: ## Complete setup and start all services
	@echo "🚀 Setting up SMART Pump with Docker..."
	@chmod +x scripts/*.sh
	@./scripts/docker-setup.sh

# Build Docker images
build: ## Build all Docker images
	@echo "🔨 Building Docker images..."
	@docker-compose build

# Start services in production mode
up: ## Start services in production mode
	@echo "🚀 Starting SMART Pump services..."
	@docker-compose up -d

# Start services in development mode
dev: ## Start services in development mode
	@echo "🚀 Starting SMART Pump in development mode..."
	@./scripts/docker-dev.sh

# Stop all services
down: ## Stop all services
	@echo "🛑 Stopping SMART Pump services..."
	@docker-compose down

# Restart all services
restart: ## Restart all services
	@echo "🔄 Restarting SMART Pump services..."
	@docker-compose restart

# View logs
logs: ## View logs for all services
	@echo "📋 Viewing SMART Pump logs..."
	@docker-compose logs -f

# View logs for specific service
logs-api: ## View logs for API service
	@docker-compose logs -f api

logs-client: ## View logs for Client service
	@docker-compose logs -f client

# Check service status
status: ## Check status of all services
	@echo "📊 SMART Pump Service Status:"
	@docker-compose ps

# Health check
health: ## Check health of all services
	@echo "🏥 Health Check:"
	@echo "API Health:"
	@curl -s http://localhost:3001/health || echo "❌ API not responding"
	@echo ""
	@echo "Client Health:"
	@curl -s http://localhost:80 > /dev/null && echo "✅ Client responding" || echo "❌ Client not responding"

# Run database migration
migrate: ## Run database migration
	@echo "🗄️ Running database migration..."
	@docker-compose run --rm migrate

# Clean everything
clean: ## Clean all Docker resources
	@echo "🧹 Cleaning SMART Pump Docker environment..."
	@./scripts/docker-clean.sh

# Clean and rebuild
rebuild: clean build up ## Clean, rebuild and start services

# Show service URLs
urls: ## Show service URLs
	@echo "🌐 SMART Pump Service URLs:"
	@echo "Frontend:  http://localhost:80"
	@echo "Backend:   http://localhost:3001"
	@echo "Health:    http://localhost:3001/health"
	@echo ""
	@echo "Demo Credentials:"
	@echo "Email:     henderson.briggs@geeknet.net"
	@echo "Password:  23derd*334"

# Development helpers
shell-api: ## Open shell in API container
	@docker-compose exec api sh

shell-client: ## Open shell in Client container
	@docker-compose exec client sh

# Production deployment
deploy: build up migrate ## Deploy to production

# Quick development setup
quick-dev: ## Quick development setup
	@echo "⚡ Quick development setup..."
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
	@make urls
