# Obsidian MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to your Obsidian vault through the Obsidian Local REST API plugin.

## Features

### Tools
- **obsidian-get-note**: Retrieve note content by filename
- **obsidian-create-note**: Create new notes with optional frontmatter
- **obsidian-update-note**: Update existing note content and metadata
- **obsidian-delete-note**: Delete notes from the vault
- **obsidian-search-notes**: Search for notes containing specific text
- **obsidian-list-files**: List all files and folders in the vault
- **obsidian-get-vault-info**: Get vault information and statistics
- **obsidian-create-folder**: Create new folders in the vault
- **obsidian-get-tags**: Get all tags used in the vault
- **obsidian-ping**: Check server connectivity

### Resources
- **obsidian://note/{filename}**: Access individual note content
- **obsidian://vault/files**: Complete file and folder listing
- **obsidian://vault/info**: Vault information and statistics
- **obsidian://vault/tags**: All tags in the vault
- **obsidian://search/{query}**: Dynamic search results

## Prerequisites

1. **Obsidian** with the **Local REST API** plugin installed and enabled
2. **Node.js** (version 18 or higher)

### Setting up Obsidian Local REST API

1. Install the [Obsidian Local REST API plugin](https://github.com/coddingtonbear/obsidian-local-rest-api)
2. Enable the plugin in Obsidian settings
3. Configure the plugin settings:
   - **Port**: Default is `27123` (or choose your preferred port)
   - **API Key**: Set a secure API key (optional but recommended)
   - **CORS**: Enable if needed for web-based MCP clients

## Installation

### From NPM (when published)
```bash
npm install -g obsidian-mcp-server
```

### From Source
```bash
git clone <repository-url>
cd obsidian-mcp-server
npm install
npm run build
```

## Configuration

The server uses environment variables for configuration:

### Using .env File (Recommended)

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your settings:
```bash
# Required: Obsidian Local REST API base URL
OBSIDIAN_API_BASE_URL=http://localhost:27123

# Optional: API key if configured in Obsidian plugin
OBSIDIAN_API_KEY=your-api-key-here
```

The server automatically loads the `.env` file when started.

### Using Environment Variables

Alternatively, you can set environment variables directly:

```bash
# Required: Obsidian Local REST API base URL
export OBSIDIAN_API_BASE_URL="http://localhost:27123"

# Optional: API key if configured in Obsidian plugin
export OBSIDIAN_API_KEY="your-api-key-here"
```

### With Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`

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

### With Other MCP Clients

For stdio transport:
```bash
OBSIDIAN_API_BASE_URL="http://localhost:27123" OBSIDIAN_API_KEY="your-key" obsidian-mcp-server
```

## Usage Examples

Once connected, you can ask your AI assistant to:

### Basic Operations
- "Show me the content of my 'Meeting Notes.md' file"
- "Create a new note called 'Ideas.md' with the content 'My brilliant ideas'"
- "Search for notes containing 'project'"
- "List all files in my vault"

### Advanced Operations
- "Create a note with frontmatter including tags and creation date"
- "Update my daily note with today's tasks"
- "Show me all tags in my vault"
- "Create a folder called 'Projects' for organizing my work"

### Working with Resources
- Access note content directly: `obsidian://note/filename.md`
- View vault statistics: `obsidian://vault/info`
- Get search results: `obsidian://search/your%20query`

## Development

### Setup
```bash
git clone <repository-url>
cd obsidian-mcp-server
npm install
```

### Development Mode
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Testing
```bash
# Test with MCP Inspector
npx @modelcontextprotocol/inspector npm run dev

# Or test with a specific configuration
OBSIDIAN_API_BASE_URL="http://localhost:27123" npx @modelcontextprotocol/inspector npm run dev
```

## API Reference

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OBSIDIAN_API_BASE_URL` | Base URL for Obsidian Local REST API | `http://localhost:27123` | No |
| `OBSIDIAN_API_KEY` | API key for authentication | - | No |

### Tool Schemas

#### obsidian-get-note
```typescript
{
  filename: string // The filename of the note to retrieve
}
```

#### obsidian-create-note
```typescript
{
  filename: string // The filename for the new note
  content: string // The content of the note
  frontmatter?: Record<string, any> // Optional frontmatter metadata
}
```

#### obsidian-search-notes
```typescript
{
  query: string // The search query text
}
```

### Resource URIs

- `obsidian://note/{filename}` - Individual note content
- `obsidian://vault/files` - Complete file listing
- `obsidian://vault/info` - Vault information
- `obsidian://vault/tags` - All tags
- `obsidian://search/{query}` - Search results

## Troubleshooting

### Connection Issues

1. **Server not accessible**: Ensure Obsidian is running and the Local REST API plugin is enabled
2. **Port conflicts**: Check if port 27123 (or your configured port) is available
3. **API key issues**: Verify the API key matches your Obsidian plugin configuration

### Common Problems

- **"Cannot find module" errors**: Run `npm install` to install dependencies
- **Permission errors**: Ensure proper file permissions for the build directory
- **CORS errors**: Enable CORS in the Obsidian Local REST API plugin settings

### Debug Mode

Run with debug logging:
```bash
DEBUG=* OBSIDIAN_API_BASE_URL="http://localhost:27123" obsidian-mcp-server
```

## 📚 Documentation

### 📖 Complete Documentation
See the **[docs/](docs/)** folder for comprehensive guides, or check the [Documentation Index](docs/README.md) for organized access to all guides.

### Setup & Configuration
- **[LM Studio Setup Guide](docs/LM_STUDIO_SETUP.md)** - Complete LM Studio configuration and deployment
- **[LM Studio Quick Start](docs/LM_STUDIO_QUICKSTART.md)** - Quick reference for LM Studio integration
- **[Environment File Usage](docs/ENV_FILE_USAGE.md)** - Using .env files with LM Studio and other clients

### Docker & Deployment
- **[Docker Deployment Guide](docs/DOCKER_DEPLOYMENT.md)** - Complete Docker containerization guide
- **[Docker Summary](docs/DOCKER_SUMMARY.md)** - Docker toolkit integration overview

### Publishing & Distribution
- **[Registry Publishing Guide](docs/REGISTRY_PUBLISHING.md)** - Complete guide to publish to Docker MCP Registry
- **[Publishing Summary](docs/PUBLISHING_SUMMARY.md)** - Quick publishing checklist and steps

### Quick Links
| Topic | Guide | Description |
|-------|-------|-------------|
| 🚀 **Getting Started** | [LM Studio Quick Start](docs/LM_STUDIO_QUICKSTART.md) | Fastest way to get running |
| 🐳 **Docker** | [Docker Summary](docs/DOCKER_SUMMARY.md) | Containerization overview |
| ⚙️ **Configuration** | [Environment Files](docs/ENV_FILE_USAGE.md) | Managing environment variables |
| 🏪 **Publishing** | [Registry Publishing](docs/REGISTRY_PUBLISHING.md) | Share with the community |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the build: `npm run build`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Related Projects

- [Obsidian](https://obsidian.md/) - A powerful knowledge base
- [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) - REST API plugin for Obsidian
- [Model Context Protocol](https://modelcontextprotocol.io/) - Protocol for AI-context integration
- [Claude Desktop](https://claude.ai/download) - AI assistant supporting MCP

---

Built with ❤️ for the Obsidian and AI community