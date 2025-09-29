#!/bin/bash

# Docker deployment script for Obsidian MCP Server
# This script helps deploy the MCP server as part of your Docker-based MCP toolkit

set -e

echo "🐳 Setting up Obsidian MCP Server for Docker deployment..."

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

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

print_success "Docker and Docker Compose are available"

# Create docker environment file if it doesn't exist
if [ ! -f ".env.docker" ]; then
    print_status "Creating Docker environment file..."
    cp .env.docker.example .env.docker
    print_success "Created .env.docker from template"
    print_warning "Please edit .env.docker file with your Obsidian settings before starting"
else
    print_success ".env.docker file already exists"
fi

# Build the Docker image
print_status "Building Docker image..."
docker build -t obsidian-mcp-server:latest .

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Create MCP toolkit network if it doesn't exist
print_status "Creating MCP toolkit network..."
docker network create mcp-toolkit-network 2>/dev/null || print_warning "Network already exists or creation failed (this is usually okay)"

print_success "Setup complete!"

echo ""
echo "🚀 Quick Start Commands:"
echo ""
echo "1. Edit configuration:"
echo "   ${YELLOW}nano .env.docker${NC}"
echo ""
echo "2. Start the MCP server:"
echo "   ${YELLOW}docker-compose --env-file .env.docker up -d${NC}"
echo ""
echo "3. View logs:"
echo "   ${YELLOW}docker-compose logs -f obsidian-mcp-server${NC}"
echo ""
echo "4. Stop the service:"
echo "   ${YELLOW}docker-compose down${NC}"
echo ""
echo "5. Rebuild after changes:"
echo "   ${YELLOW}docker-compose build && docker-compose up -d${NC}"
echo ""
echo "6. Include test interface:"
echo "   ${YELLOW}docker-compose --profile testing up -d${NC}"
echo ""

# Check if Obsidian is running
print_status "Checking if Obsidian Local REST API is accessible..."
if curl -s "http://localhost:27123" > /dev/null 2>&1; then
    print_success "Obsidian Local REST API is accessible on port 27123"
else
    print_warning "Obsidian Local REST API is not accessible on port 27123"
    echo "Make sure:"
    echo "  - Obsidian is running"
    echo "  - Local REST API plugin is installed and enabled"
    echo "  - Plugin is configured to use port 27123"
fi

echo ""
print_success "Obsidian MCP Server is ready for Docker deployment!"
echo "The server will be accessible to other containers in the 'mcp-toolkit-network'"