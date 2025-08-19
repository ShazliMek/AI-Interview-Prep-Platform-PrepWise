/**
 * MCP Service - Client for interacting with the Model Context Protocol server
 */

interface MCPRequest {
  toolName: string;
  parameters: Record<string, unknown>;
}

interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

/**
 * Service for interacting with the MCP server
 */
export class MCPService {
  /**
   * Invoke a tool on the MCP server
   */
  static async invokeTool<T>(toolName: string, parameters: Record<string, unknown> = {}): Promise<T> {
    try {
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolName, parameters }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Error invoking tool: ${response.statusText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Error invoking MCP tool "${toolName}":`, error);
      throw error;
    }
  }

  /**
   * Get a list of all available tools
   */
  static async getTools(): Promise<MCPTool[]> {
    try {
      const response = await fetch('/api/mcp', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error fetching tools: ${response.statusText}`);
      }

      const result = await response.json();
      return result.tools;
    } catch (error) {
      console.error('Error fetching MCP tools:', error);
      throw error;
    }
  }

  /**
   * Get interview questions based on job role and difficulty
   */
  static async getInterviewQuestions(role: string, difficulty: string): Promise<{ questions: string[] }> {
    return await this.invokeTool('interview.getQuestions', { role, difficulty });
  }

  /**
   * Analyze an interview response
   */
  static async analyzeResponse(
    question: string, 
    response: string, 
    role: string
  ): Promise<{
    score: number;
    strengths: string[];
    improvements: string[];
    suggestions: string;
  }> {
    return await this.invokeTool('interview.analyzeResponse', { question, response, role });
  }

  /**
   * Orchestrate multiple AI models for a complex task
   */
  static async orchestrateModels(
    task: string, 
    models: string[]
  ): Promise<{
    result: string;
    modelResults: { model: string; output: string }[];
  }> {
    return await this.invokeTool('models.orchestrate', { task, models });
  }
}
