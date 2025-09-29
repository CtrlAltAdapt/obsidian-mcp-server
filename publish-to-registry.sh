#!/bin/bash

# Script to help publish Obsidian MCP Server to Docker MCP Registry
# This script guides you through the publishing process

set -e

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

echo "🚀 Obsidian MCP Server - Registry Publishing Helper"
echo "===================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "Dockerfile" ]; then
    print_error "Please run this script from the obsidian-mcp-server directory"
    exit 1
fi

# Step 1: Check for secrets in Docker image
print_status "Step 1: Checking for secrets in Docker build..."
echo ""

# Build test image
print_status "Building test image to check for secrets..."
docker build -t obsidian-mcp-security-test . > /dev/null 2>&1

# Check for .env files
env_files=$(docker run --rm obsidian-mcp-security-test find /app -name ".env*" -type f 2>/dev/null | grep -v ".env.example" || true)

if [ -n "$env_files" ]; then
    print_error "Found secret files in Docker image:"
    echo "$env_files"
    print_error "Please update .dockerignore to exclude these files"
    exit 1
else
    print_success "No secret files found in Docker image ✅"
fi

# Clean up test image
docker rmi obsidian-mcp-security-test > /dev/null 2>&1

echo ""

# Step 2: Check package.json metadata
print_status "Step 2: Checking package.json metadata..."

if ! grep -q '"repository"' package.json; then
    print_warning "Missing repository information in package.json"
    echo "Please add repository URL to package.json"
fi

if ! grep -q '"homepage"' package.json; then
    print_warning "Missing homepage information in package.json"
fi

if grep -q '"author": "Your Name"' package.json; then
    print_warning "Please update author information in package.json"
fi

print_success "Package.json check completed"
echo ""

# Step 3: Verify tools.json exists
print_status "Step 3: Checking tools.json..."

if [ ! -f "tools.json" ]; then
    print_error "tools.json file not found"
    print_error "This file is required to prevent build failures in the registry"
    exit 1
else
    print_success "tools.json file found ✅"
fi

echo ""

# Step 4: GitHub repository check
print_status "Step 4: GitHub repository requirements..."
echo ""

echo "📋 Before submitting to Docker MCP Registry, ensure:"
echo "   ✅ Your code is pushed to a public GitHub repository"
echo "   ✅ Repository has a clear README.md"
echo "   ✅ Repository has proper licensing (MIT recommended)"
echo "   ✅ Dockerfile is in the repository root"
echo ""

# Step 5: Next steps
print_status "Step 5: Next steps for registry submission..."
echo ""

echo "🏪 To submit to Docker MCP Registry:"
echo ""
echo "1. Fork the registry repository:"
echo "   ${YELLOW}https://github.com/docker/mcp-registry${NC}"
echo ""
echo "2. Install prerequisites:"
echo "   ${YELLOW}brew install go go-task/tap/go-task${NC}"
echo ""
echo "3. Clone your fork and run the wizard:"
echo "   ${YELLOW}git clone https://github.com/yourusername/mcp-registry.git${NC}"
echo "   ${YELLOW}cd mcp-registry${NC}"
echo "   ${YELLOW}task wizard${NC}"
echo ""
echo "4. Follow the interactive prompts:"
echo "   - Category: ${YELLOW}knowledge-management${NC}"
echo "   - GitHub URL: ${YELLOW}https://github.com/yourusername/obsidian-mcp-server${NC}"
echo "   - Environment variables: ${YELLOW}OBSIDIAN_API_BASE_URL, OBSIDIAN_API_KEY${NC}"
echo ""
echo "5. Test locally:"
echo "   ${YELLOW}task build -- --tools obsidian-mcp-server${NC}"
echo "   ${YELLOW}task catalog -- obsidian-mcp-server${NC}"
echo ""
echo "6. Submit Pull Request with:"
echo "   - Clear description of your MCP server"
echo "   - Category: knowledge-management"
echo "   - Prerequisites for users"
echo ""

# Step 6: Registry benefits
echo ""
print_status "🎯 Benefits after registry approval:"
echo ""
echo "✅ Hosted in official Docker Hub MCP namespace"
echo "✅ Cryptographic signatures and provenance tracking"
echo "✅ Automatic security updates"
echo "✅ Discoverable in Docker Desktop MCP Toolkit"
echo "✅ Easy installation for users worldwide"
echo ""

# Step 7: User installation after publishing
echo "📦 After publishing, users can install with:"
echo ""
echo "Docker Desktop:"
echo "   Open Docker Desktop → MCP Toolkit → Search 'obsidian' → Install"
echo ""
echo "Command Line:"
echo "   ${YELLOW}docker pull mcp/obsidian-mcp-server${NC}"
echo ""

print_success "Pre-publication checks completed! ✅"
print_status "Ready for Docker MCP Registry submission"
echo ""
echo "📖 For detailed instructions, see: ${YELLOW}docs/REGISTRY_PUBLISHING.md${NC}"