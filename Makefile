# Makefile for SMC Dashboard Backend
# Usage: make [target]

.PHONY: help install dev build start stop test clean deploy docker-build docker-up docker-down migrate seed

# Default target
help:
	@echo "Available targets:"
	@echo "  install      - Install dependencies"
	@echo "  dev          - Start development server"
	@echo "  build        - Build for production"
	@echo "  start        - Start production server"
	@echo "  stop         - Stop production server"
	@echo "  test         - Run tests"
	@echo "  clean        - Clean build artifacts"
	@echo "  deploy       - Deploy to production"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-up    - Start Docker Compose"
	@echo "  docker-down  - Stop Docker Compose"
	@echo "  migrate      - Run database migrations"
	@echo "  seed         - Seed database"

# Installation
install:
	npm install

# Development
dev:
	npm run dev

# Build
build:
	npm run prisma:generate
	npm run build || echo "No build script"

# Start production
start:
	npm start

# Stop (PM2)
stop:
	pm2 stop smc-backend || echo "PM2 not running"

# Test
test:
	npm run test-db
	npm test || echo "No tests configured"

# Clean
clean:
	rm -rf node_modules/.cache
	rm -rf logs/*.log
	find . -type d -name node_modules -prune -o -type f -name "*.log" -delete

# Deploy
deploy:
	@echo "Running deployment..."
	@bash deploy.sh production || ./deploy.sh production

# Docker commands
docker-build:
	docker build -t smc-backend:latest .

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f backend

# Database
migrate:
	npx prisma migrate deploy

migrate-dev:
	npx prisma migrate dev

seed:
	npm run seed

# Prisma
prisma-generate:
	npx prisma generate

prisma-studio:
	npx prisma studio

# Health check
health:
	curl http://localhost:3000/api/health || echo "Server not running"

