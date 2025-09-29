import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface ObsidianClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
}

export interface ObsidianNote {
  filename: string;
  content: string;
  stat?: {
    ctime: number;
    mtime: number;
    size: number;
  };
  frontmatter?: Record<string, any>;
}

export interface VaultInfo {
  name: string;
  path: string;
}

export interface FileInfo {
  name: string;
  path: string;
  isFolder: boolean;
  size?: number;
  ctime?: number;
  mtime?: number;
}

export class ObsidianClient {
  private client: AxiosInstance;

  constructor(config: ObsidianClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey && { "Authorization": `Bearer ${config.apiKey}` })
      }
    });
  }

  /**
   * Get note content by filename
   */
  async getNote(filename: string): Promise<ObsidianNote> {
    try {
      const response: AxiosResponse<ObsidianNote> = await this.client.get(`/vault/${encodeURIComponent(filename)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get note "${filename}": ${error}`);
    }
  }

  /**
   * Create a new note
   */
  async createNote(filename: string, content: string, frontmatter?: Record<string, any>): Promise<ObsidianNote> {
    try {
      // If frontmatter is provided, we need to include it in the content
      let fullContent = content;
      if (frontmatter) {
        const frontmatterString = Object.entries(frontmatter)
          .map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
          .join('\n');
        fullContent = `---\n${frontmatterString}\n---\n\n${content}`;
      }
      
      const response: AxiosResponse<ObsidianNote> = await this.client.put(
        `/vault/${encodeURIComponent(filename)}`, 
        fullContent,
        {
          headers: {
            'Content-Type': 'text/markdown'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create note "${filename}": ${error}`);
    }
  }

  /**
   * Update an existing note
   */
  async updateNote(filename: string, content: string, frontmatter?: Record<string, any>): Promise<ObsidianNote> {
    try {
      // If frontmatter is provided, we need to include it in the content
      let fullContent = content;
      if (frontmatter) {
        const frontmatterString = Object.entries(frontmatter)
          .map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
          .join('\n');
        fullContent = `---\n${frontmatterString}\n---\n\n${content}`;
      }
      
      // Send content as plain text body instead of JSON object
      const response: AxiosResponse<ObsidianNote> = await this.client.put(
        `/vault/${encodeURIComponent(filename)}`, 
        fullContent,
        {
          headers: {
            'Content-Type': 'text/markdown'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update note "${filename}": ${error}`);
    }
  }

  /**
   * Delete a note
   */
  async deleteNote(filename: string): Promise<void> {
    try {
      await this.client.delete(`/vault/${encodeURIComponent(filename)}`);
    } catch (error) {
      throw new Error(`Failed to delete note "${filename}": ${error}`);
    }
  }

  /**
   * Search for notes containing specific text
   */
  async searchNotes(query: string): Promise<string[]> {
    try {
      const response: AxiosResponse<{ filenames: string[] }> = await this.client.post("/search/simple", {
        query
      });
      return response.data.filenames || [];
    } catch (error) {
      throw new Error(`Failed to search notes: ${error}`);
    }
  }

  /**
   * List all files and folders in the vault
   */
  async listFiles(path = ""): Promise<FileInfo[]> {
    try {
      const endpoint = path ? `/vault/${encodeURIComponent(path)}` : "/vault/";
      const response: AxiosResponse<{ files: FileInfo[] }> = await this.client.get(endpoint);
      return response.data.files || [];
    } catch (error) {
      throw new Error(`Failed to list files in path "${path}": ${error}`);
    }
  }

  /**
   * Get vault information
   */
  async getVaultInfo(): Promise<VaultInfo> {
    try {
      const response: AxiosResponse<VaultInfo> = await this.client.get("/");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get vault info: ${error}`);
    }
  }

  /**
   * Create a folder
   */
  async createFolder(folderPath: string): Promise<void> {
    try {
      await this.client.put(`/vault/${encodeURIComponent(folderPath)}/`, {});
    } catch (error) {
      throw new Error(`Failed to create folder "${folderPath}": ${error}`);
    }
  }

  /**
   * Get note by path (handles nested folders)
   */
  async getNoteByPath(path: string): Promise<ObsidianNote> {
    try {
      const response: AxiosResponse<ObsidianNote> = await this.client.get(`/vault/${path}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get note at path "${path}": ${error}`);
    }
  }

  /**
   * Check if the server is accessible
   */
  async ping(): Promise<boolean> {
    try {
      await this.client.get("/");
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all tags used in the vault
   */
  async getTags(): Promise<string[]> {
    try {
      const response: AxiosResponse<{ tags: string[] }> = await this.client.get("/tags/");
      return response.data.tags || [];
    } catch (error) {
      throw new Error(`Failed to get tags: ${error}`);
    }
  }
}