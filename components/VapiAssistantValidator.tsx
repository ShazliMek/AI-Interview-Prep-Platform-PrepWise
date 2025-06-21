"use client";

import { useState } from 'react';

export default function VapiAssistantValidator() {
  const [result, setResult] = useState<string>('');

  const validateAssistant = async () => {
    setResult('Validating assistant...');
    
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    const webToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    
    if (!assistantId || !webToken) {
      setResult(prev => prev + '\n✗ Missing environment variables');
      return;
    }
    
    try {
      // Try to fetch assistant details directly from Vapi API
      setResult(prev => prev + '\n🔄 Checking if assistant exists...');
      
      const response = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${webToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const assistantData = await response.json();
        setResult(prev => prev + '\n✓ Assistant exists!');
        setResult(prev => prev + `\n✓ Assistant name: ${assistantData.name || 'No name'}`);
        setResult(prev => prev + `\n✓ Assistant model: ${assistantData.model?.provider || 'Unknown'}`);
        setResult(prev => prev + `\n✓ Assistant voice: ${assistantData.voice?.provider || 'Unknown'}`);
        
        // Check if assistant has required configuration
        if (!assistantData.model) {
          setResult(prev => prev + '\n⚠️ WARNING: No model configured');
        }
        if (!assistantData.voice) {
          setResult(prev => prev + '\n⚠️ WARNING: No voice configured');
        }
        if (!assistantData.transcriber) {
          setResult(prev => prev + '\n⚠️ WARNING: No transcriber configured');
        }
        
      } else {
        setResult(prev => prev + `\n✗ Assistant not found or invalid: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        setResult(prev => prev + `\n✗ Error details: ${errorText}`);
      }
      
    } catch (error: any) {
      setResult(prev => prev + `\n✗ Network error: ${error.message}`);
    }
  };

  const testWebToken = async () => {
    setResult('Testing web token...');
    
    const webToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    
    if (!webToken) {
      setResult(prev => prev + '\n✗ No web token found');
      return;
    }
    
    try {
      // Test if web token is valid by calling Vapi API
      const response = await fetch('https://api.vapi.ai/assistant', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${webToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const assistants = await response.json();
        setResult(prev => prev + '\n✓ Web token is valid!');
        setResult(prev => prev + `\n✓ Found ${assistants.length || 0} assistants in your account`);
        
        if (assistants.length > 0) {
          setResult(prev => prev + '\n📋 Your assistants:');
          assistants.slice(0, 5).forEach((assistant: any, index: number) => {
            setResult(prev => prev + `\n  ${index + 1}. ${assistant.name || 'Unnamed'} (ID: ${assistant.id})`);
          });
        }
      } else {
        setResult(prev => prev + `\n✗ Web token invalid: ${response.status} ${response.statusText}`);
      }
      
    } catch (error: any) {
      setResult(prev => prev + `\n✗ Network error: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Vapi Assistant Validator</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={validateAssistant}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Validate Assistant
          </button>
          
          <button
            onClick={testWebToken}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Web Token
          </button>
          
          <button
            onClick={() => setResult('')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
        
        <div className="bg-black text-green-400 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{result || 'Click a button to start validation...'}</pre>
        </div>
      </div>
    </div>
  );
}
