#!/usr/bin/env node

// Test script to debug the update note issue
import { config } from "dotenv";
config();

import { ObsidianClient } from "./build/obsidian-client.js";

const OBSIDIAN_API_BASE_URL = process.env.OBSIDIAN_API_BASE_URL || "http://localhost:27123";
const OBSIDIAN_API_KEY = process.env.OBSIDIAN_API_KEY || "";

async function testUpdateNote() {
  const client = new ObsidianClient(OBSIDIAN_API_BASE_URL, OBSIDIAN_API_KEY);
  
  try {
    console.log("🧪 Testing note update...");
    
    // First, create a test note
    console.log("📝 Creating test note...");
    const testNote = await client.createNote("test-update.md", "Original content", { 
      created: new Date().toISOString() 
    });
    console.log("✅ Created:", testNote);
    
    // Now update it with the problematic content
    console.log("🔄 Updating test note with 'hello world'...");
    const updatedNote = await client.updateNote("test-update.md", "hello world");
    console.log("✅ Updated:", updatedNote);
    
    // Retrieve the note to see the actual content
    console.log("📖 Reading back the note...");
    const retrievedNote = await client.getNote("test-update.md");
    console.log("📄 Retrieved content:");
    console.log("--- START ---");
    console.log(retrievedNote.content);
    console.log("--- END ---");
    
    // Check if the content is exactly "hello world" and not {"content":"hello world"}
    if (retrievedNote.content.trim() === "hello world") {
      console.log("✅ SUCCESS: Content is correct!");
    } else {
      console.log("❌ FAILED: Content is still wrapped in JSON:");
      console.log("Expected: 'hello world'");
      console.log("Got:", JSON.stringify(retrievedNote.content));
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testUpdateNote();