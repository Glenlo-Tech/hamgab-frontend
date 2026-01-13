.PHONY: help dev build docker-dev docker-prod docker-build clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development
dev: ## Run all apps in development mode
	pnpm dev

build: ## Build all apps
	pnpm build

# Docker Development
docker-dev: ## Start all apps in Docker (development mode)
	docker-compose -f docker-compose.dev.yml up

docker-dev-build: ## Build and start all apps in Docker (development mode)
	docker-compose -f docker-compose.dev.yml up --build

docker-dev-down: ## Stop development containers
	docker-compose -f docker-compose.dev.yml down

docker-dev-logs: ## View development logs
	docker-compose -f docker-compose.dev.yml logs -f

# Docker Production
docker-prod: ## Start all apps in Docker (production mode)
	docker-compose up -d

docker-prod-build: ## Build and start all apps in Docker (production mode)
	docker-compose up --build -d

docker-prod-down: ## Stop production containers
	docker-compose down

docker-prod-logs: ## View production logs
	docker-compose logs -f

# Individual Docker Builds
docker-build-public: ## Build public website Docker image
	docker build -f Dockerfile.public -t propflow-public .

docker-build-agent: ## Build agent portal Docker image
	docker build -f Dockerfile.agent -t propflow-agent .

docker-build-admin: ## Build admin portal Docker image
	docker build -f Dockerfile.admin -t propflow-admin .

docker-build-all: docker-build-public docker-build-agent docker-build-admin ## Build all Docker images

# Cleanup
clean: ## Clean build artifacts and node_modules
	pnpm clean

docker-clean: ## Remove all Docker containers, images, and volumes
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all

# Status
status: ## Show running containers
	docker-compose ps
	docker-compose -f docker-compose.dev.yml ps

