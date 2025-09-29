import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianClient } from "../obsidian-client.js";
import { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";

export function setupObsidianResources(mcpServer: McpServer, obsidianClient: ObsidianClient) {
  // Resource: Individual note content
  mcpServer.registerResource(
    "obsidian-note",
    new ResourceTemplate("obsidian://note/{filename}", { 
      list: async () => {
        try {
          const files = await obsidianClient.listFiles();
          const noteFiles = files.filter(file => !file.isFolder && file.name.endsWith('.md'));
          
          return {
            resources: noteFiles.map(file => ({
              name: file.name,
              uri: `obsidian://note/${encodeURIComponent(file.name)}`,
              description: `Obsidian note: ${file.name}`,
              mimeType: "text/markdown"
            }))
          };
        } catch (error) {
          return {
            resources: []
          };
        }
      }
    }),
    {
      title: "Obsidian Note",
      description: "Access individual notes from the Obsidian vault",
      mimeType: "text/markdown"
    },
    async (uri, { filename }): Promise<ReadResourceResult> => {
      try {
        const noteFilename = Array.isArray(filename) ? filename[0] : filename;
        const note = await obsidianClient.getNote(noteFilename);
        
        // Prepare the content with frontmatter if it exists
        let content = note.content;
        if (note.frontmatter && Object.keys(note.frontmatter).length > 0) {
          const frontmatterYaml = Object.entries(note.frontmatter)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\\n');
          content = `---\\n${frontmatterYaml}\\n---\\n\\n${note.content}`;
        }

        return {
          contents: [
            {
              uri: uri.href,
              text: content,
              mimeType: "text/markdown"
            }
          ]
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: uri.href,
              text: `Error loading note: ${error instanceof Error ? error.message : String(error)}`,
              mimeType: "text/plain"
            }
          ]
        };
      }
    }
  );

  // Resource: Vault file listing
  mcpServer.registerResource(
    "obsidian-vault-files",
    "obsidian://vault/files",
    {
      title: "Vault File Listing",
      description: "Complete listing of all files and folders in the Obsidian vault",
      mimeType: "application/json"
    },
    async (): Promise<ReadResourceResult> => {
      try {
        const files = await obsidianClient.listFiles();
        const fileStructure = {
          totalFiles: files.length,
          files: files.map(file => ({
            name: file.name,
            path: file.path,
            isFolder: file.isFolder,
            size: file.size,
            lastModified: file.mtime ? new Date(file.mtime).toISOString() : null,
            created: file.ctime ? new Date(file.ctime).toISOString() : null
          }))
        };

        return {
          contents: [
            {
              uri: "obsidian://vault/files",
              text: JSON.stringify(fileStructure, null, 2),
              mimeType: "application/json"
            }
          ]
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: "obsidian://vault/files",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
                files: []
              }, null, 2),
              mimeType: "application/json"
            }
          ]
        };
      }
    }
  );

  // Resource: Vault information
  mcpServer.registerResource(
    "obsidian-vault-info",
    "obsidian://vault/info",
    {
      title: "Vault Information",
      description: "General information about the Obsidian vault",
      mimeType: "application/json"
    },
    async (): Promise<ReadResourceResult> => {
      try {
        const vaultInfo = await obsidianClient.getVaultInfo();
        const files = await obsidianClient.listFiles();
        const noteCount = files.filter(file => !file.isFolder && file.name.endsWith('.md')).length;
        const folderCount = files.filter(file => file.isFolder).length;

        const enhancedInfo = {
          ...vaultInfo,
          statistics: {
            totalFiles: files.length,
            noteCount,
            folderCount,
            lastScanned: new Date().toISOString()
          }
        };

        return {
          contents: [
            {
              uri: "obsidian://vault/info",
              text: JSON.stringify(enhancedInfo, null, 2),
              mimeType: "application/json"
            }
          ]
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: "obsidian://vault/info",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
                name: "Unknown",
                path: "Unknown"
              }, null, 2),
              mimeType: "application/json"
            }
          ]
        };
      }
    }
  );

  // Resource: All tags in the vault
  mcpServer.registerResource(
    "obsidian-tags",
    "obsidian://vault/tags",
    {
      title: "Vault Tags",
      description: "All tags used throughout the Obsidian vault",
      mimeType: "application/json"
    },
    async (): Promise<ReadResourceResult> => {
      try {
        const tags = await obsidianClient.getTags();
        const tagInfo = {
          totalTags: tags.length,
          tags: tags.sort(),
          lastUpdated: new Date().toISOString()
        };

        return {
          contents: [
            {
              uri: "obsidian://vault/tags",
              text: JSON.stringify(tagInfo, null, 2),
              mimeType: "application/json"
            }
          ]
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: "obsidian://vault/tags",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
                tags: [],
                totalTags: 0
              }, null, 2),
              mimeType: "application/json"
            }
          ]
        };
      }
    }
  );

  // Resource: Search results as a dynamic resource
  mcpServer.registerResource(
    "obsidian-search",
    new ResourceTemplate("obsidian://search/{query}", { 
      list: undefined // Search results are dynamic, no list needed
    }),
    {
      title: "Search Results",
      description: "Search results for notes containing specific text",
      mimeType: "application/json"
    },
    async (uri, { query }): Promise<ReadResourceResult> => {
      try {
        const searchQuery = Array.isArray(query) ? query[0] : query;
        const decodedQuery = decodeURIComponent(searchQuery);
        const filenames = await obsidianClient.searchNotes(decodedQuery);
        
        const searchResults = {
          query: decodedQuery,
          resultCount: filenames.length,
          files: filenames,
          searchTime: new Date().toISOString()
        };

        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify(searchResults, null, 2),
              mimeType: "application/json"
            }
          ]
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify({
                query: Array.isArray(query) ? query[0] : query,
                error: error instanceof Error ? error.message : String(error),
                files: [],
                resultCount: 0
              }, null, 2),
              mimeType: "application/json"
            }
          ]
        };
      }
    }
  );
}