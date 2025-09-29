import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ObsidianClient } from "../obsidian-client.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function setupObsidianTools(mcpServer: McpServer, obsidianClient: ObsidianClient) {
  // Tool: Get note content
  mcpServer.registerTool(
    "obsidian-get-note",
    {
      title: "Get Obsidian Note",
      description: "Retrieve the content of a note by filename",
      inputSchema: {
        filename: z.string().describe("The filename of the note to retrieve (e.g., 'My Note.md')")
      }
    },
    async ({ filename }): Promise<CallToolResult> => {
      try {
        const note = await obsidianClient.getNote(filename);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                filename: note.filename,
                content: note.content,
                frontmatter: note.frontmatter,
                stat: note.stat
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool: Create new note
  mcpServer.registerTool(
    "obsidian-create-note",
    {
      title: "Create Obsidian Note",
      description: "Create a new note with specified content",
      inputSchema: {
        filename: z.string().describe("The filename for the new note (e.g., 'My New Note.md')"),
        content: z.string().describe("The content of the note"),
        frontmatter: z.record(z.any()).optional().describe("Optional frontmatter metadata as key-value pairs")
      }
    },
    async ({ filename, content, frontmatter }): Promise<CallToolResult> => {
      try {
        const note = await obsidianClient.createNote(filename, content, frontmatter);
        return {
          content: [
            {
              type: "text",
              text: `Successfully created note "${note.filename}"`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool: Update existing note
  mcpServer.registerTool(
    "obsidian-update-note",
    {
      title: "Update Obsidian Note",
      description: "Update an existing note with new content",
      inputSchema: {
        filename: z.string().describe("The filename of the note to update"),
        content: z.string().describe("The new content for the note"),
        frontmatter: z.record(z.any()).optional().describe("Optional frontmatter metadata as key-value pairs")
      }
    },
    async ({ filename, content, frontmatter }): Promise<CallToolResult> => {
      try {
        const note = await obsidianClient.updateNote(filename, content, frontmatter);
        return {
          content: [
            {
              type: "text",
              text: `Successfully updated note "${note.filename}"`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool: Delete note
  mcpServer.registerTool(
    "obsidian-delete-note",
    {
      title: "Delete Obsidian Note",
      description: "Delete a note from the vault",
      inputSchema: {
        filename: z.string().describe("The filename of the note to delete")
      }
    },
    async ({ filename }): Promise<CallToolResult> => {
      try {
        await obsidianClient.deleteNote(filename);
        return {
          content: [
            {
              type: "text",
              text: `Successfully deleted note "${filename}"`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool: Search notes
  mcpServer.registerTool(
    "obsidian-search-notes",
    {
      title: "Search Obsidian Notes",
      description: "Search for notes containing specific text",
      inputSchema: {
        query: z.string().describe("The search query text")
      }
    },
    async ({ query }): Promise<CallToolResult> => {
      try {
        const filenames = await obsidianClient.searchNotes(query);
        return {
          content: [
            {
              type: "text",
              text: `Found ${filenames.length} notes matching "${query}":\\n${filenames.map(name => `- ${name}`).join('\\n')}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool: List vault files
  mcpServer.registerTool(
    "obsidian-list-files",
    {
      title: "List Vault Files",
      description: "List all files and folders in the vault or a specific path",
      inputSchema: {
        path: z.string().optional().describe("Optional path to list files from (empty for root)")
      }
    },
    async ({ path = "" }): Promise<CallToolResult> => {
      try {
        const files = await obsidianClient.listFiles(path);
        const fileList = files.map(file => {
          const type = file.isFolder ? "📁" : "📄";
          const size = file.size ? ` (${file.size} bytes)` : "";
          return `${type} ${file.name}${size}`;
        }).join('\\n');
        
        return {
          content: [
            {
              type: "text",
              text: `Files in ${path || "vault root"}:\\n${fileList}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool: Get vault info
  mcpServer.registerTool(
    "obsidian-get-vault-info",
    {
      title: "Get Vault Info",
      description: "Get information about the Obsidian vault",
      inputSchema: {}
    },
    async (): Promise<CallToolResult> => {
      try {
        const vaultInfo = await obsidianClient.getVaultInfo();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(vaultInfo, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool: Create folder
  mcpServer.registerTool(
    "obsidian-create-folder",
    {
      title: "Create Folder",
      description: "Create a new folder in the vault",
      inputSchema: {
        folderPath: z.string().describe("The path for the new folder")
      }
    },
    async ({ folderPath }): Promise<CallToolResult> => {
      try {
        await obsidianClient.createFolder(folderPath);
        return {
          content: [
            {
              type: "text",
              text: `Successfully created folder "${folderPath}"`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool: Get tags
  mcpServer.registerTool(
    "obsidian-get-tags",
    {
      title: "Get All Tags",
      description: "Get all tags used in the vault",
      inputSchema: {}
    },
    async (): Promise<CallToolResult> => {
      try {
        const tags = await obsidianClient.getTags();
        return {
          content: [
            {
              type: "text",
              text: `Tags in vault (${tags.length}):\\n${tags.map(tag => `- ${tag}`).join('\\n')}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool: Ping Obsidian server
  mcpServer.registerTool(
    "obsidian-ping",
    {
      title: "Ping Obsidian Server",
      description: "Check if the Obsidian Local REST API server is accessible",
      inputSchema: {}
    },
    async (): Promise<CallToolResult> => {
      try {
        const isAccessible = await obsidianClient.ping();
        return {
          content: [
            {
              type: "text",
              text: isAccessible 
                ? "✅ Obsidian server is accessible" 
                : "❌ Obsidian server is not accessible"
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );
}