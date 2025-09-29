#!/bin/bash

# LM Studio MCP Setup Script for Obsidian
# This script helps configure the Obsidian MCP server for use with LM Studio

set -e

echo "🚀 Setting up Obsidian MCP Server for LM Studio..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the obsidian-mcp-server directory"
    exit 1
fi

# Setup environment file
echo "⚙️  Setting up environment configuration..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "📝 Please edit .env file with your Obsidian settings"
else
    echo "✅ .env file already exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build successful"

# Make globally available
echo "🔗 Making globally available..."
npm link

if [ $? -eq 0 ]; then
    echo "✅ Global installation successful"
    echo "📍 You can now use 'obsidian-mcp-server' command globally"
else
    echo "⚠️  Global installation failed, but you can still use the local build"
fi

# Test connection to Obsidian
echo "🧪 Testing connection to Obsidian..."

# Check if Obsidian REST API is accessible
OBSIDIAN_URL="${OBSIDIAN_API_BASE_URL:-http://localhost:27123}"

if curl -s "$OBSIDIAN_URL" > /dev/null 2>&1; then
    echo "✅ Obsidian REST API is accessible at $OBSIDIAN_URL"
else
    echo "⚠️  Cannot reach Obsidian REST API at $OBSIDIAN_URL"
    echo "   Make sure:"
    echo "   1. Obsidian is running"
    echo "   2. Local REST API plugin is installed and enabled"
    echo "   3. The URL/port is correct"
fi

# Create LM Studio configuration template
echo "📝 Creating LM Studio configuration template..."

LM_STUDIO_CONFIG_DIR="$HOME/Library/Application Support/LM Studio"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    LM_STUDIO_CONFIG_DIR="$HOME/.config/lm-studio"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    LM_STUDIO_CONFIG_DIR="$APPDATA/LM Studio"
fi

CONFIG_TEMPLATE="lm-studio-mcp-config.json"

cat > "$CONFIG_TEMPLATE" << EOF
{
  "mcpServers": {
    "obsidian": {
      "command": "obsidian-mcp-server",
      "env": {
        "OBSIDIAN_API_BASE_URL": "http://localhost:27123",
        "OBSIDIAN_API_KEY": ""
      },
      "description": "Obsidian vault integration via Local REST API"
    }
  }
}
EOF

echo "✅ Created LM Studio configuration template: $CONFIG_TEMPLATE"

# Create environment file template
cat > ".env.example" << EOF
# Obsidian Local REST API Configuration
OBSIDIAN_API_BASE_URL=http://localhost:27123
OBSIDIAN_API_KEY=

# Optional: Debug mode
# DEBUG=*
EOF

echo "✅ Created environment template: .env.example"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the configuration from $CONFIG_TEMPLATE to your LM Studio config directory:"
echo "   $LM_STUDIO_CONFIG_DIR/mcp_config.json"
echo ""
echo "2. If you use an API key in Obsidian, update the OBSIDIAN_API_KEY in the config"
echo ""
echo "3. Restart LM Studio to load the new MCP server"
echo ""
echo "4. Test by asking LM Studio: 'List all files in my Obsidian vault'"
echo ""
echo "🔧 Troubleshooting:"
echo "- If connection fails, run: node test-connection.mjs"
echo "- Check Obsidian Local REST API plugin is enabled"
echo "- Verify the port (default: 27123) matches your Obsidian settings"
echo ""