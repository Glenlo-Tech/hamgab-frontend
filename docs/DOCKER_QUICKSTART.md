# 🐳 Docker Quick Start

Get all three portals running in seconds!

## ⚡ One Command Start

### Development Mode (Hot Reload)
```bash
make docker-dev
```

### Production Mode
```bash
make docker-prod-build
```

That's it! 🎉

## 📍 Access Your Apps

After starting, access:
- **Public**: http://localhost:3000
- **Agent**: http://localhost:3001
- **Admin**: http://localhost:3002

## 🛑 Stop Everything

```bash
make docker-dev-down    # Stop dev containers
make docker-prod-down   # Stop prod containers
```

## 📋 Prerequisites

- Docker installed
- Docker Compose installed
- Make (optional, but recommended)

## 🔧 Setup (First Time Only)

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your URLs** (optional, defaults work for local)

3. **Start:**
   ```bash
   make docker-dev
   ```

## 📚 More Commands

```bash
make help              # See all commands
make docker-dev-logs   # View logs
make status            # Check status
make docker-clean      # Clean everything
```

## 🐛 Troubleshooting

**Port already in use?**
- Change ports in `docker-compose.dev.yml` or `docker-compose.yml`

**Container won't start?**
```bash
make docker-dev-logs   # Check logs
```

**Need to rebuild?**
```bash
make docker-dev-build  # Rebuild and start
```

## 📖 Full Documentation

See [DOCKER.md](./DOCKER.md) for complete guide.

---

**That's all you need!** Just run `make docker-dev` and you're ready! 🚀

