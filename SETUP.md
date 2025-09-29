# Quick Setup Guide

## 1. Install Obsidian Local REST API Plugin

1. Open Obsidian
2. Go to Settings → Community Plugins
3. Browse and search for "Local REST API"
4. Install and enable the plugin
5. Configure the plugin:
   - Port: `27123` (default)
   - API Key: (optional, but recommended for security)
   - Enable CORS if needed

## 2. Test the API Connection

```bash
# Test if the API is accessible
curl http://localhost:27123/

# If you set an API key:
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:27123/
```

## 3. Install and Run the MCP Server

```bash
# Clone and build
git clone <your-repo>
cd obsidian-mcp-server
npm install
npm run build

# Set environment variables
export OBSIDIAN_API_BASE_URL="http://localhost:27123"
export OBSIDIAN_API_KEY="your-api-key"  # if you set one

# Test the connection
node test-connection.mjs

# Run the MCP server
npm start
```

## 4. Configure Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["/path/to/obsidian-mcp-server/build/index.js"],
      "env": {
        "OBSIDIAN_API_BASE_URL": "http://localhost:27123",
        "OBSIDIAN_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 5. Test with Claude

Try asking Claude:
- "List all my notes"
- "Show me the content of my daily note"
- "Create a new note called 'Test' with some content"
- "Search for notes containing 'meeting'"

## Troubleshooting

- **Connection refused**: Make sure Obsidian is running and the plugin is enabled
- **Unauthorized**: Check your API key configuration
- **CORS errors**: Enable CORS in the plugin settings
- **Port conflicts**: Change the port in both Obsidian plugin and MCP server config