# 🐳 Docker Guide

Complete Docker setup for the HAMGAB Agent Portal monorepo.

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Make (optional, for easier commands)

## 🚀 Quick Start

### Development Mode (Hot Reload)

```bash
# Start all apps in development mode
make docker-dev
# or
pnpm docker:dev

# Build and start
make docker-dev-build
# or
pnpm docker:dev:build
```

**Access:**
- Public: http://localhost:3000
- Agent: http://localhost:3001
- Admin: http://localhost:3002

### Production Mode

```bash
# Build and start all apps in production mode
make docker-prod-build
# or
pnpm docker:prod:build

# Start existing containers
make docker-prod
# or
pnpm docker:prod
```

## 📦 Individual App Builds

### Build Individual Images

```bash
# Build public website
make docker-build-public
# or
pnpm docker:build:public

# Build agent portal
make docker-build-agent
# or
pnpm docker:build:agent

# Build admin portal
make docker-build-admin
# or
pnpm docker:build:admin

# Build all images
make docker-build-all
# or
pnpm docker:build:all
```

### Run Individual Containers

```bash
# Public website
docker run -p 3000:3000 propflow-public

# Agent portal
docker run -p 3001:3001 propflow-agent

# Admin portal
docker run -p 3002:3002 propflow-admin
```

## 🛠️ Available Commands

### Using Make (Recommended)

```bash
make help              # Show all available commands
make dev               # Run locally (without Docker)
make docker-dev        # Start dev containers
make docker-prod       # Start prod containers
make docker-dev-down   # Stop dev containers
make docker-prod-down  # Stop prod containers
make docker-dev-logs   # View dev logs
make docker-prod-logs   # View prod logs
make status            # Show container status
make docker-clean      # Clean all Docker resources
```

### Using pnpm

```bash
pnpm docker:dev              # Start dev containers
pnpm docker:dev:build        # Build and start dev containers
pnpm docker:dev:down         # Stop dev containers
pnpm docker:prod             # Start prod containers
pnpm docker:prod:build       # Build and start prod containers
pnpm docker:prod:down        # Stop prod containers
pnpm docker:build:public     # Build public image
pnpm docker:build:agent      # Build agent image
pnpm docker:build:admin      # Build admin image
pnpm docker:build:all        # Build all images
```

### Using Docker Compose Directly

```bash
# Development
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml logs -f

# Production
docker-compose up -d
docker-compose up --build -d
docker-compose down
docker-compose logs -f
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in root directory:

```env
# Public Website
NEXT_PUBLIC_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000

# Agent Portal
NEXT_PUBLIC_AGENT_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:8000

# Admin Portal
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
NEXT_PUBLIC_API_URL=http://localhost:8000

# Auth (if using)
NEXT_PUBLIC_AUTH_DOMAIN=auth.domain.com
```

Or override in `docker-compose.yml`:

```yaml
services:
  public:
    environment:
      - NEXT_PUBLIC_PUBLIC_URL=https://domain.com
      - NEXT_PUBLIC_API_URL=https://api.domain.com
```

### Ports

Default ports (can be changed in `docker-compose.yml`):

- **Public**: 3000
- **Agent**: 3001
- **Admin**: 3002

To change ports:

```yaml
services:
  public:
    ports:
      - "8080:3000"  # Host:Container
```

## 📁 Docker Files

### Production Dockerfiles

- `Dockerfile.public` - Public website
- `Dockerfile.agent` - Agent portal
- `Dockerfile.admin` - Admin portal

### Development Dockerfile

- `Dockerfile.dev` - Multi-stage for all apps (development)

### Compose Files

- `docker-compose.yml` - Production setup
- `docker-compose.dev.yml` - Development setup

## 🔍 Debugging

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f public
docker-compose logs -f agent
docker-compose logs -f admin

# Development logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Enter Container

```bash
# Public container
docker exec -it propflow-public sh

# Agent container
docker exec -it propflow-agent sh

# Admin container
docker exec -it propflow-admin sh
```

### Check Container Status

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Container stats
docker stats
```

### Rebuild After Changes

```bash
# Rebuild specific service
docker-compose build public
docker-compose up -d public

# Rebuild all
docker-compose build
docker-compose up -d
```

## 🧹 Cleanup

### Stop Containers

```bash
# Development
make docker-dev-down
# or
docker-compose -f docker-compose.dev.yml down

# Production
make docker-prod-down
# or
docker-compose down
```

### Remove Everything

```bash
# Remove containers, networks, and volumes
make docker-clean
# or
docker-compose down -v --rmi all
docker-compose -f docker-compose.dev.yml down -v --rmi all
```

### Remove Images

```bash
# Remove specific image
docker rmi propflow-public
docker rmi propflow-agent
docker rmi propflow-admin

# Remove all images
docker image prune -a
```

## 🚢 Deployment

### Build for Production

```bash
# Build all images
make docker-build-all

# Tag for registry
docker tag propflow-public your-registry/propflow-public:latest
docker tag propflow-agent your-registry/propflow-agent:latest
docker tag propflow-admin your-registry/propflow-admin:latest

# Push to registry
docker push your-registry/propflow-public:latest
docker push your-registry/propflow-agent:latest
docker push your-registry/propflow-admin:latest
```

### Deploy with Docker Compose

```bash
# On server
git clone <repo>
cd HAMGAB-AGENT-PORTAL
docker-compose up -d
```

### Deploy Individual Services

```bash
# Pull images
docker pull your-registry/propflow-public:latest
docker pull your-registry/propflow-agent:latest
docker pull your-registry/propflow-admin:latest

# Run containers
docker run -d -p 3000:3000 --name propflow-public your-registry/propflow-public:latest
docker run -d -p 3001:3001 --name propflow-agent your-registry/propflow-agent:latest
docker run -d -p 3002:3002 --name propflow-admin your-registry/propflow-admin:latest
```

## 🔐 Security Best Practices

1. **Use .env files** - Never commit secrets
2. **Multi-stage builds** - Smaller production images
3. **Non-root user** - Run containers as non-root (add to Dockerfiles)
4. **Health checks** - Already configured in docker-compose.yml
5. **Resource limits** - Add to docker-compose.yml:

```yaml
services:
  public:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

## 📊 Monitoring

### Health Checks

Health checks are configured in `docker-compose.yml`. Check status:

```bash
docker ps
# Check STATUS column for health
```

### Resource Usage

```bash
# Real-time stats
docker stats

# Specific container
docker stats propflow-public
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
# or
netstat -tulpn | grep 3000

# Kill process or change port in docker-compose.yml
```

### Container Won't Start

```bash
# Check logs
docker-compose logs public

# Check container status
docker ps -a

# Restart container
docker-compose restart public
```

### Build Fails

```bash
# Clear build cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache
```

### Volume Issues

```bash
# List volumes
docker volume ls

# Remove volumes
docker volume prune
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)

## ✅ Quick Reference

```bash
# Start everything (dev)
make docker-dev

# Start everything (prod)
make docker-prod-build

# Stop everything
make docker-prod-down

# View logs
make docker-prod-logs

# Clean everything
make docker-clean
```

That's it! Your apps are now dockerized and ready to deploy! 🎉

