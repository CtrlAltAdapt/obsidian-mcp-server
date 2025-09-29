# Quick LM Studio Configuration

## 🚀 One-Command Setup

```bash
./setup-lm-studio.sh
```

## 📋 Manual Configuration

### 1. Create .env File
```bash
cp .env.example .env
# Edit .env with your settings:
# OBSIDIAN_API_BASE_URL=http://localhost:27123
# OBSIDIAN_API_KEY=your-api-key-here
```

### 2. LM Studio MCP Config Location
- **macOS**: `~/Library/Application Support/LM Studio/mcp_config.json`
- **Windows**: `%APPDATA%\LM Studio\mcp_config.json`  
- **Linux**: `~/.config/lm-studio/mcp_config.json`

### 3. Configuration Content (Using .env file)
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "obsidian-mcp-server",
      "cwd": "/Users/umar/Work/obsidian"
    }
  }
}
```

### 4. Alternative: Direct Environment Variables
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["/Users/umar/Work/obsidian/build/index.js"],
      "cwd": "/Users/umar/Work/obsidian",
      "env": {
        "OBSIDIAN_API_BASE_URL": "http://localhost:27123",
        "OBSIDIAN_API_KEY": ""
      }
    }
  }
}
```

## 🧪 Test Commands

### In LM Studio Chat:
- `"List all my Obsidian notes"`
- `"Show me the content of my daily note"`
- `"Create a note called 'Test' with some content"`
- `"Search for notes containing 'meeting'"`

### Command Line Test:
```bash
npm run test
```

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Command not found" | Run `npm run global-install` |
| "Cannot connect to Obsidian" | Check if Obsidian + REST API plugin is running |
| "Permission denied" | Run `chmod +x build/index.js` |
| "Port already in use" | Change port in Obsidian REST API settings |

## ⚙️ Environment Variables

```bash
export OBSIDIAN_API_BASE_URL="http://localhost:27123"
export OBSIDIAN_API_KEY="your-key-here"  # Optional
```

---
**Need help?** See `LM_STUDIO_SETUP.md` for detailed instructions.