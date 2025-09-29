# Configuring Obsidian MCP Server with LM Studio

LM Studio supports MCP (Model Context Protocol) integration, allowing you to connect your Obsidian vault to local language models.

## Prerequisites

1. **LM Studio** (latest version with MCP support)
2. **Obsidian** with Local REST API plugin
3. **Node.js** (version 18+)
4. **Built Obsidian MCP Server**

## Step 1: Prepare the MCP Server

1. **Build the server** (if not already done):
   ```bash
   cd /Users/umar/Work/obsidian
   npm run build
   ```

2. **Set up environment configuration**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env file with your Obsidian settings
   # OBSIDIAN_API_BASE_URL=http://localhost:27123
   # OBSIDIAN_API_KEY=your-api-key-here
   ```

3. **Test the connection** to Obsidian:
   ```bash
   # Make sure Obsidian is running with Local REST API plugin enabled
   node test-connection.mjs
   ```

## Step 2: Configure LM Studio

### Method 1: Using .env File (Recommended)

1. **Open LM Studio**
2. **Go to Settings** → **Developer** → **MCP Servers**
3. **Add a new MCP server** with these settings:
   - **Name**: `obsidian`
   - **Command**: `obsidian-mcp-server`
   - **Working Directory**: `/Users/umar/Work/obsidian`
   - **Environment Variables**: *(Leave empty - will use .env file)*

### Method 2: Using LM Studio's Environment Variables

1. **Open LM Studio**
2. **Go to Settings** → **Developer** → **MCP Servers**  
3. **Add a new MCP server** with these settings:
   - **Name**: `obsidian`
   - **Command**: `node`
   - **Arguments**: `["/Users/umar/Work/obsidian/build/index.js"]`
   - **Working Directory**: `/Users/umar/Work/obsidian`
   - **Environment Variables**:
     ```
     OBSIDIAN_API_BASE_URL=http://localhost:27123
     OBSIDIAN_API_KEY=your-api-key-here
     ```

### Method 2: Using Configuration File

Create or edit LM Studio's MCP configuration file:

**Location**: 
- **macOS**: `~/Library/Application Support/LM Studio/mcp_config.json`
- **Windows**: `%APPDATA%\LM Studio\mcp_config.json`
- **Linux**: `~/.config/lm-studio/mcp_config.json`

**Configuration**:
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["/Users/umar/Work/obsidian/build/index.js"],
      "env": {
        "OBSIDIAN_API_BASE_URL": "http://localhost:27123",
        "OBSIDIAN_API_KEY": ""
      },
      "description": "Obsidian vault integration via Local REST API"
    }
  }
}
```

### Method 3: Using npm Global Install (Recommended)

1. **Make the package globally installable**:
   ```bash
   cd /Users/umar/Work/obsidian
   npm link
   ```

2. **Configure LM Studio** to use the global command:
   ```json
   {
     "mcpServers": {
       "obsidian": {
         "command": "obsidian-mcp-server",
         "env": {
           "OBSIDIAN_API_BASE_URL": "http://localhost:27123",
           "OBSIDIAN_API_KEY": ""
         }
       }
     }
   }
   ```

## Step 3: Environment Configuration

Create a `.env` file in your home directory or project directory:

```bash
# ~/.env or /Users/umar/Work/obsidian/.env
OBSIDIAN_API_BASE_URL=http://localhost:27123
OBSIDIAN_API_KEY=your-api-key-if-set
```

## Step 4: Start LM Studio with MCP

1. **Restart LM Studio** after adding the configuration
2. **Load a model** (any local model you prefer)
3. **Start a chat session**
4. **Verify MCP connection** - you should see the Obsidian server listed in available tools/resources

## Step 5: Test the Integration

Try these prompts in LM Studio:

### Basic Tests
```
"List all files in my Obsidian vault"
"Show me the content of [filename].md"
"Search for notes containing 'project'"
```

### Advanced Tests
```
"Create a new note called 'LM Studio Test' with today's date"
"Show me all tags in my vault"
"Get information about my vault"
```

## Alternative: Direct Command Line Usage

If LM Studio doesn't support MCP yet or you prefer command line:

1. **Create a wrapper script** (`lm-studio-obsidian.sh`):
   ```bash
   #!/bin/bash
   export OBSIDIAN_API_BASE_URL="http://localhost:27123"
   export OBSIDIAN_API_KEY=""
   
   # Start MCP server in background
   node /Users/umar/Work/obsidian/build/index.js &
   MCP_PID=$!
   
   # Start LM Studio with MCP
   lm-studio --mcp-server stdio
   
   # Cleanup
   kill $MCP_PID
   ```

2. **Make executable and run**:
   ```bash
   chmod +x lm-studio-obsidian.sh
   ./lm-studio-obsidian.sh
   ```

## Troubleshooting

### Common Issues

1. **"MCP server not found"**
   - Check the path to `build/index.js` is correct
   - Ensure the build was successful (`npm run build`)
   - Verify Node.js is in your PATH

2. **"Cannot connect to Obsidian"**
   - Make sure Obsidian is running
   - Verify Local REST API plugin is enabled
   - Check the port (default: 27123)
   - Test with: `curl http://localhost:27123/`

3. **"Permission denied"**
   - Check file permissions: `chmod +x build/index.js`
   - Ensure Node.js can execute the script

4. **"API key authentication failed"**
   - Verify the API key matches Obsidian plugin settings
   - Try without API key first (leave empty)

### Debug Mode

Enable debug logging:

```bash
# Set debug environment
export DEBUG=*
export OBSIDIAN_API_BASE_URL="http://localhost:27123"

# Run with debug output
node build/index.js
```

### Test Connection Manually

```bash
# Test the MCP server directly
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node build/index.js
```

## LM Studio-Specific Notes

- **Model Selection**: Any model in LM Studio should work with MCP
- **Performance**: Local models may be slower than cloud-based options
- **Memory**: Ensure sufficient RAM for both LM Studio and Obsidian
- **Concurrent Access**: The MCP server can handle multiple requests

## Example Usage Scenarios

### Research Workflow
1. Ask LM Studio to search your notes for specific topics
2. Have it create summaries of existing notes
3. Generate new notes based on research findings

### Daily Planning
1. Create daily notes with structured templates
2. Review yesterday's notes and create today's agenda
3. Tag and organize notes automatically

### Knowledge Management
1. Find connections between notes
2. Create index notes linking related content
3. Generate topic clusters from your vault

---

**Need Help?** Check the main README.md for more detailed troubleshooting and configuration options.