import Vapi from '@vapi-ai/web'

// Type definitions for better type safety
export interface VapiVariableValues {
  [key: string]: string | number | boolean;
}

export interface VapiAssistantOverrides {
  variableValues?: VapiVariableValues;
  firstMessage?: string;
  // Add other override properties as needed based on VAPI docs
}

export interface VapiStartOptions {
  assistantOverrides?: VapiAssistantOverrides;
  // Add other start options as needed
}

// Create and export the Vapi instance
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!)

// Export a function to get a fresh Vapi instance
export function getVapiInstance() {
  return new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!)
}

// Helper function to validate environment variables
export function validateVapiConfig() {
  const webToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  const generateAssistantId = process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID;
  
  if (!webToken) {
    throw new Error('NEXT_PUBLIC_VAPI_WEB_TOKEN is required');
  }
  
  if (!assistantId && !generateAssistantId) {
    throw new Error('At least one of NEXT_PUBLIC_VAPI_ASSISTANT_ID or NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID is required');
  }
  
  return {
    webToken,
    assistantId,
    generateAssistantId
  };
}

// Helper function to start a call with proper error handling
export async function startVapiCall(
  assistantId: string, 
  overrides?: VapiAssistantOverrides
): Promise<void> {
  try {
    console.log('Starting VAPI call:', { 
      assistantId, 
      overrides: JSON.stringify(overrides, null, 2) 
    });
    
    // Add tracing for debugging
    console.log('VAPI SDK Connection Ready:', !!vapi);
    
    if (overrides) {
      // Log each variable being passed for troubleshooting
      if (overrides.variableValues) {
        console.log('Variables being sent to assistant:');
        Object.entries(overrides.variableValues).forEach(([key, value]) => {
          console.log(`  - ${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
        });
      }
      
      // Start with assistant ID and overrides
      await vapi.start(assistantId, overrides);
    } else {
      // Start with just assistant ID
      await vapi.start(assistantId);
    }
    
    console.log('VAPI call started successfully');
  } catch (error) {
    console.error('Failed to start VAPI call:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    throw error;
  }
}