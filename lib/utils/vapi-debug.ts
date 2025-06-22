/**
 * Helper utility for debugging Vapi assistant interactions
 */

/**
 * Send debug information about Vapi interactions to server-side logging
 */
export async function logVapiDebug(type: string, details: Record<string, unknown>) {
  try {
    // Don't log in production to avoid performance issues
    if (process.env.NODE_ENV === 'production') return;
    
    console.log(`Logging Vapi debug (${type}):`, details);
    
    const response = await fetch('/api/vapi-debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        details,
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to send Vapi debug log to server');
    }
  } catch (error) {
    console.error('Error sending Vapi debug log:', error);
  }
}

/**
 * Check if variables are being used in a response message
 */
export function checkVariableUsage(message: string, variables: Record<string, string | number | boolean | null | undefined>) {
  const results: Record<string, boolean> = {};
  
  // Check each variable
  Object.entries(variables).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim()) {
      results[key] = message.includes(value);
    }
  });
  
  return results;
}
