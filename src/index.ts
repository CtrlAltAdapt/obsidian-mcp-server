#!/usr/bin/env node

// Load environment variables from .env file
import { config } from "dotenv";
config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ObsidianClient } from "./obsidian-client.js";
import { setupObsidianTools } from "./tools/index.js";
import { setupObsidianResources } from "./resources/index.js";

// Configuration from environment variables
const OBSIDIAN_API_BASE_URL = process.env.OBSIDIAN_API_BASE_URL || "http://localhost:27123";
const OBSIDIAN_API_KEY = process.env.OBSIDIAN_API_KEY || "";

// Create the MCP server
const mcpServer = new McpServer({
  name: "obsidian-mcp-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
    resources: {},
    prompts: {},
    logging: {}
  }
});

// Initialize Obsidian client
const obsidianClient = new ObsidianClient({
  baseURL: OBSIDIAN_API_BASE_URL,
  apiKey: OBSIDIAN_API_KEY
});

// Setup tools and resources
setupObsidianTools(mcpServer, obsidianClient);
setupObsidianResources(mcpServer, obsidianClient);

async function main() {
  try {
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    console.error("Obsidian MCP server running on stdio");
  } catch (error) {
    console.error("Failed to start Obsidian MCP server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});