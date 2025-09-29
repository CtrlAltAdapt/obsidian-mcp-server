# Docker Deployment Guide for Obsidian MCP Server

## 🐳 Docker Setup for MCP Toolkit

This guide helps you deploy the Obsidian MCP Server as part of your containerized MCP toolkit.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Obsidian running on host machine with Local REST API plugin
- Port 27123 accessible from Docker containers

## 🚀 Quick Start

### 1. Automated Setup
```bash
# Run the setup script
./docker-setup.sh
```

### 2. Manual Setup

#### Configure Environment
```bash
# Copy Docker environment template
cp .env.docker.example .env.docker

# Edit with your settings
nano .env.docker
```

#### Build and Start
```bash
# Build the image
docker build -t obsidian-mcp-server:latest .

# Start the service
docker-compose --env-file .env.docker up -d
```

## 📁 Docker Files Overview

### Core Files
- `Dockerfile` - Multi-stage Node.js Alpine image
- `docker-compose.yml` - Service orchestration
- `.dockerignore` - Optimized build context
- `.env.docker.example` - Environment template

### Scripts
- `docker-setup.sh` - Automated setup and deployment
- `docker-compose.yml` - Production and testing profiles

## 🔧 Configuration

### Environment Variables (.env.docker)
```bash
# Obsidian API endpoint (from container perspective)
OBSIDIAN_API_BASE_URL=http://host.docker.internal:27123

# Optional API key
OBSIDIAN_API_KEY=your-api-key-here

# Debug logging
DEBUG=mcp:*

# Docker project name
COMPOSE_PROJECT_NAME=mcp-toolkit
```

### Network Configuration
The service joins `mcp-toolkit-network` for inter-container communication.

## 🎯 Usage Patterns

### Standalone Deployment
```bash
docker run -d \
  --name obsidian-mcp-server \
  --add-host host.docker.internal:host-gateway \
  -e OBSIDIAN_API_BASE_URL=http://host.docker.internal:27123 \
  obsidian-mcp-server:latest
```

### Part of MCP Toolkit Stack
```yaml
# In your main docker-compose.yml
services:
  obsidian-mcp:
    image: obsidian-mcp-server:latest
    environment:
      - OBSIDIAN_API_BASE_URL=http://host.docker.internal:27123
    networks:
      - mcp-toolkit-network
      
  your-ai-assistant:
    # Your AI service that uses MCP
    depends_on:
      - obsidian-mcp
    networks:
      - mcp-toolkit-network
```

### With Testing Interface
```bash
# Start with test interface
docker-compose --profile testing --env-file .env.docker up -d

# Access test interface
curl http://localhost:3001/health
```

## 🔍 Management Commands

### View Logs
```bash
# Follow logs
docker-compose logs -f obsidian-mcp-server

# View recent logs
docker logs obsidian-mcp-server --tail 50
```

### Health Checks
```bash
# Check container health
docker ps --filter name=obsidian-mcp-server

# Manual health check
docker exec obsidian-mcp-server node -e "console.log('MCP Server is ready')"
```

### Updates and Rebuilds
```bash
# Rebuild after code changes
docker-compose build obsidian-mcp-server

# Restart with new image
docker-compose up -d obsidian-mcp-server

# Full restart
docker-compose down && docker-compose up -d
```

## 🚨 Troubleshooting

### Common Issues

**Container can't reach Obsidian**
```bash
# Check if Obsidian is accessible from container
docker exec obsidian-mcp-server wget -qO- http://host.docker.internal:27123 || echo "Failed"

# Verify host.docker.internal resolution
docker exec obsidian-mcp-server nslookup host.docker.internal
```

**Permission Issues**
```bash
# Check container user
docker exec obsidian-mcp-server id

# Fix file permissions
sudo chown -R 1001:1001 /path/to/obsidian-mcp-server
```

**Network Issues**
```bash
# Inspect network
docker network inspect mcp-toolkit-network

# Recreate network
docker network rm mcp-toolkit-network
docker network create mcp-toolkit-network
```

### Debug Mode
```bash
# Run with debug output
docker-compose --env-file .env.docker up obsidian-mcp-server

# Interactive debugging
docker run -it --rm \
  --add-host host.docker.internal:host-gateway \
  -e OBSIDIAN_API_BASE_URL=http://host.docker.internal:27123 \
  obsidian-mcp-server:latest /bin/sh
```

## 🔒 Security Considerations

- Container runs as non-root user (uid: 1001)
- No unnecessary ports exposed
- Environment variables for sensitive data
- Network isolation with dedicated network
- Health checks for monitoring

## 📊 Resource Usage

### Image Size
- Base: ~50MB (Node.js Alpine)
- Built: ~100MB (with dependencies)
- Runtime: ~20MB RAM usage

### Performance
- Startup: ~2-3 seconds
- Memory: ~20-30MB steady state
- CPU: Minimal (I/O bound operations)

## 🔗 Integration Examples

### With Portainer
```yaml
# portainer-compose.yml
version: '3.8'
services:
  obsidian-mcp:
    image: obsidian-mcp-server:latest
    deploy:
      replicas: 1
      restart_policy:
        condition: unless-stopped
```

### With Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: obsidian-mcp-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: obsidian-mcp-server
  template:
    metadata:
      labels:
        app: obsidian-mcp-server
    spec:
      containers:
      - name: obsidian-mcp-server
        image: obsidian-mcp-server:latest
        env:
        - name: OBSIDIAN_API_BASE_URL
          value: "http://host.docker.internal:27123"
```

---

🎉 **Your Obsidian MCP Server is now containerized and ready for production deployment!**