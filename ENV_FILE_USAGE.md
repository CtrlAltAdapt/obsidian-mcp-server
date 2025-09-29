# Using .env Files with LM Studio

## 🔧 How It Works

When LM Studio starts your MCP server, it runs the command from the **working directory** you specify. The server automatically loads environment variables from a `.env` file in that directory.

## 📁 Setup Steps

### 1. Create Your .env File
```bash
# In your project directory
cp .env.example .env
```

### 2. Edit .env File
```bash
# Obsidian MCP Server Environment Configuration
OBSIDIAN_API_BASE_URL=http://localhost:27123
OBSIDIAN_API_KEY=your-api-key-here
```

### 3. Configure LM Studio

**Recommended Method**: Use working directory + .env file

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

**Alternative Method**: Direct environment variables in LM Studio

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "obsidian-mcp-server",
      "env": {
        "OBSIDIAN_API_BASE_URL": "http://localhost:27123",
        "OBSIDIAN_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 🎯 Key Points

1. **Working Directory**: Set `"cwd": "/path/to/your/project"` in LM Studio config
2. **Automatic Loading**: The server uses `dotenv` to load `.env` automatically
3. **No Environment Variables Needed**: When using `.env`, you can omit the `"env"` section in LM Studio
4. **Priority**: LM Studio `"env"` variables override `.env` file variables if both are present

## 🔍 Troubleshooting

- **"Cannot find .env"**: Make sure the working directory (`cwd`) is set correctly
- **"Variables not loaded"**: Check that `.env` file is in the same directory as the built server
- **"Permission denied"**: Ensure `.env` file has proper read permissions

## 📝 Example LM Studio Configuration

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

This configuration:
- Runs the globally installed `obsidian-mcp-server` command
- Sets working directory to your project folder
- Automatically loads `.env` file from that directory
- No need to specify environment variables in LM Studio