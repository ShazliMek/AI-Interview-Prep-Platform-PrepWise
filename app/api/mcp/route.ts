import { NextRequest, NextResponse } from 'next/server';
import mcpServer from '@/backend/mcp/server';

/**
 * API route for the MCP server
 * 
 * This endpoint handles Model Context Protocol (MCP) requests
 * It allows models to be orchestrated and tools to be invoked
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolName, parameters } = body;

    if (!toolName) {
      return NextResponse.json({ error: 'Missing required field: toolName' }, { status: 400 });
    }

    const response = await mcpServer.handleRequest({ toolName, parameters: parameters || {} });
    
    if (!response.success) {
      return NextResponse.json({ error: response.error }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error in MCP API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // List all available tools when GET request is made
  const tools = mcpServer.getTools();
  return NextResponse.json({ tools });
}
