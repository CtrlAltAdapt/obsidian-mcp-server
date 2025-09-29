#!/usr/bin/env node

// Simple test script to verify the Obsidian MCP server functionality
import { ObsidianClient } from './src/obsidian-client.js';

const OBSIDIAN_API_BASE_URL = process.env.OBSIDIAN_API_BASE_URL || "http://localhost:27123";
const OBSIDIAN_API_KEY = process.env.OBSIDIAN_API_KEY || "";

async function testConnection() {
  console.log("🧪 Testing Obsidian MCP Server...");
  console.log(`📡 API Base URL: ${OBSIDIAN_API_BASE_URL}`);
  
  const client = new ObsidianClient({
    baseURL: OBSIDIAN_API_BASE_URL,
    apiKey: OBSIDIAN_API_KEY
  });

  try {
    console.log("🔍 Testing connection...");
    const isAccessible = await client.ping();
    
    if (isAccessible) {
      console.log("✅ Connection successful!");
      
      // Test getting vault info
      console.log("📊 Getting vault information...");
      const vaultInfo = await client.getVaultInfo();
      console.log(`📁 Vault: ${vaultInfo.name} at ${vaultInfo.path}`);
      
      // Test listing files
      console.log("📋 Listing files...");
      const files = await client.listFiles();
      console.log(`📄 Found ${files.length} files/folders`);
      
      // Test getting tags (might fail if no tags exist)
      try {
        console.log("🏷️  Getting tags...");
        const tags = await client.getTags();
        console.log(`🏷️  Found ${tags.length} tags`);
      } catch (tagError) {
        console.log("⚠️  Could not retrieve tags (this is normal if no tags exist)");
      }
      
      console.log("🎉 All tests passed! The Obsidian MCP server should work correctly.");
      
    } else {
      console.log("❌ Connection failed!");
      console.log("💡 Make sure:");
      console.log("   1. Obsidian is running");
      console.log("   2. Local REST API plugin is installed and enabled");
      console.log("   3. The API URL is correct");
      console.log("   4. The API key (if set) is correct");
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error instanceof Error ? error.message : String(error));
    console.log("💡 Troubleshooting:");
    console.log("   1. Check if Obsidian is running");
    console.log("   2. Verify the Local REST API plugin is enabled");
    console.log("   3. Check the API URL and port");
    console.log("   4. Verify network connectivity");
  }
}

testConnection();