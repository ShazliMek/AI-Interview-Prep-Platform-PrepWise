"use client";

import { useState } from 'react';
import { vapi } from '@/lib/vapi.sdk';

export default function VapiDebugTest() {
  const [result, setResult] = useState<string>('');

  const testVapiDirectly = async () => {
    setResult('Testing Vapi directly...');
    
    try {
      // Test 1: Check if vapi object exists and has methods
      setResult(prev => prev + '\n✓ Vapi object exists');
      setResult(prev => prev + `\n✓ Vapi methods: ${Object.getOwnPropertyNames(Object.getPrototypeOf(vapi)).join(', ')}`);
      
      // Test 2: Check environment variables
      const assistant = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
      const webToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
      
      setResult(prev => prev + `\n✓ Assistant ID: ${assistant || 'MISSING'}`);
      setResult(prev => prev + `\n✓ Web Token: ${webToken ? `Present (${webToken.length} chars)` : 'MISSING'}`);
      
      if (!assistant) {
        setResult(prev => prev + '\n✗ No assistant ID available');
        return;
      }
      
      // Test 3: Try different API call formats to find the correct one
      setResult(prev => prev + '\n🔄 Testing different API formats...');
      
      // Format 1: assistantId (old format)
      try {
        setResult(prev => prev + '\n🔄 Trying format 1: { assistantId }');
        await vapi.start({ assistantId: assistant } as any);
        setResult(prev => prev + '\n✓ Format 1 SUCCESS!');
        return;
      } catch (error: any) {
        setResult(prev => prev + `\n✗ Format 1 failed: ${error.message}`);
      }
      
      // Format 2: assistant (current format)
      try {
        setResult(prev => prev + '\n🔄 Trying format 2: { assistant }');
        await vapi.start({ assistant: assistant } as any);
        setResult(prev => prev + '\n✓ Format 2 SUCCESS!');
        return;
      } catch (error: any) {
        setResult(prev => prev + `\n✗ Format 2 failed: ${error.message}`);
      }
      
      // Format 3: Direct assistant string
      try {
        setResult(prev => prev + '\n🔄 Trying format 3: assistant string directly');
        await vapi.start(assistant as any);
        setResult(prev => prev + '\n✓ Format 3 SUCCESS!');
        return;
      } catch (error: any) {
        setResult(prev => prev + `\n✗ Format 3 failed: ${error.message}`);
      }
      
      // Format 4: Check if it expects a different structure
      try {
        setResult(prev => prev + '\n🔄 Trying format 4: { id }');
        await vapi.start({ id: assistant } as any);
        setResult(prev => prev + '\n✓ Format 4 SUCCESS!');
        return;
      } catch (error: any) {
        setResult(prev => prev + `\n✗ Format 4 failed: ${error.message}`);
      }
      
      setResult(prev => prev + '\n✗ ALL FORMATS FAILED - checking Vapi documentation needed');
      
    } catch (error: any) {
      setResult(prev => prev + `\n✗ General Error: ${error.message}`);
      
      // Log detailed error information
      if (error.response) {
        setResult(prev => prev + `\n✗ Response status: ${error.response.status}`);
        setResult(prev => prev + `\n✗ Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      
      if (error.request) {
        setResult(prev => prev + `\n✗ Request details: ${JSON.stringify(error.request, null, 2)}`);
      }
    }
  };

  const stopCall = async () => {
    try {
      await vapi.stop();
      setResult(prev => prev + '\n✓ Call stopped');
    } catch (error: any) {
      setResult(prev => prev + `\n✗ Stop error: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Vapi Direct API Test</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={testVapiDirectly}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Test Vapi Directly
          </button>
          
          <button
            onClick={stopCall}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Stop Call
          </button>
          
          <button
            onClick={() => setResult('')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
        
        <div className="bg-black text-green-400 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{result || 'Click "Test Vapi Directly" to start debugging...'}</pre>
        </div>
      </div>
    </div>
  );
}
