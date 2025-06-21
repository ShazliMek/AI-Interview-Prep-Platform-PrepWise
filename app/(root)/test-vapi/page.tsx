"use client";

import { useState, useEffect } from 'react';
import { vapi } from '@/lib/vapi.sdk';
import VapiDebugTest from '@/components/VapiDebugTest';
import VapiAssistantValidator from '@/components/VapiAssistantValidator';
import EncryptionSystemTest from '@/components/EncryptionSystemTest';

export default function TestVapiPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [callStatus, setCallStatus] = useState('INACTIVE');
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user from API instead of direct import
    fetch('/api/user/current')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(console.error);

    // Test Vapi connection
    const testConnection = () => {
      try {
        // Check if vapi is properly initialized
        if (vapi) {
          setIsConnected(true);
          setMessages(prev => [...prev, "✓ Vapi SDK initialized successfully"]);
        }
      } catch (err) {
        setError(`Failed to initialize Vapi: ${err}`);
        setMessages(prev => [...prev, `✗ Vapi initialization failed: ${err}`]);
      }
    };

    testConnection();

    // Set up event listeners
    const handleCallStart = () => {
      setCallStatus('ACTIVE');
      setMessages(prev => [...prev, "✓ Call started successfully"]);
    };

    const handleCallEnd = () => {
      setCallStatus('FINISHED');
      setMessages(prev => [...prev, "✓ Call ended"]);
    };

    const handleMessage = (message: any) => {
      console.log('Vapi message:', message);
      if (message.type === 'transcript' && message.transcript) {
        setMessages(prev => [...prev, `Transcript: ${message.transcript}`]);
      }
    };

    const handleError = (error: any) => {
      console.error('Vapi error:', error);
      setError(`Vapi error: ${error.message || error}`);
      setMessages(prev => [...prev, `✗ Error: ${error.message || error}`]);
    };

    // Add event listeners
    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('message', handleMessage);
    vapi.on('error', handleError);

    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('message', handleMessage);
      vapi.off('error', handleError);
    };
  }, []);

  const testBasicCall = async () => {
    setError(null);
    setMessages(prev => [...prev, "🔄 Starting basic call test..."]);
    
    try {
      const assistant = process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID;
      
      if (!assistant || assistant === 'your_actual_generate_assistant_id') {
        throw new Error("NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID not properly set in environment variables");
      }

      setMessages(prev => [...prev, `Using assistant ID: ${assistant}`]);
      setMessages(prev => [...prev, `Web token: ${process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN ? 'Set (length: ' + process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN.length + ')' : 'Not set'}`]);
      
      // Log the exact config being sent - Vapi expects just the assistant ID string
      setMessages(prev => [...prev, `Call with assistant ID: ${assistant}`]);
      
      await vapi.start(assistant);
      setCallStatus('CONNECTING');
      setMessages(prev => [...prev, "✓ Call initiated successfully"]);
    } catch (err: any) {
      setError(`Failed to start call: ${err.message}`);
      setMessages(prev => [...prev, `✗ Call failed: ${err.message}`]);
      
      // Log additional error details
      if (err.response) {
        setMessages(prev => [...prev, `API Response: ${JSON.stringify(err.response)}`]);
      }
    }
  };

  const testInterviewCall = async () => {
    setError(null);
    setMessages(prev => [...prev, "🔄 Starting interview call test..."]);
    
    try {
      const assistant = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
      
      if (!assistant) {
        throw new Error("NEXT_PUBLIC_VAPI_ASSISTANT_ID not set in environment variables");
      }

      setMessages(prev => [...prev, `Using interview assistant: ${assistant}`]);
      setMessages(prev => [...prev, `Calling with assistant ID directly`]);
      
      await vapi.start(assistant);
      setCallStatus('CONNECTING');
      setMessages(prev => [...prev, "✓ Interview call initiated successfully"]);
    } catch (err: any) {
      setError(`Failed to start interview call: ${err.message}`);
      setMessages(prev => [...prev, `✗ Interview call failed: ${err.message}`]);
      
      // Log additional error details
      if (err.response) {
        setMessages(prev => [...prev, `API Response: ${JSON.stringify(err.response)}`]);
      }
    }
  };

  const endCall = async () => {
    try {
      await vapi.stop();
      setMessages(prev => [...prev, "🔄 Ending call..."]);
    } catch (err: any) {
      setError(`Failed to end call: ${err.message}`);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Vapi Integration Test</h1>
      
      {/* Connection Status */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          User: {user ? `${user.name} (${user.email})` : 'Not logged in'}
        </p>
        <p className="text-sm text-gray-600">
          Call Status: <span className="font-mono">{callStatus}</span>
        </p>
      </div>

      {/* Environment Check */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <div className="space-y-1 text-sm font-mono">
          <div>VAPI_WEB_TOKEN: {process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN ? '✓ Set' : '✗ Missing'}</div>
          <div>VAPI_ASSISTANT_ID: {process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ? '✓ Set' : '✗ Missing'}</div>
          <div>VAPI_GENERATE_ASSISTANT_ID: {process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID ? '✓ Set' : '✗ Missing'}</div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={testBasicCall}
          disabled={callStatus === 'ACTIVE' || !isConnected}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Basic Call
        </button>
        
        <button
          onClick={testInterviewCall}
          disabled={callStatus === 'ACTIVE' || !isConnected}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Interview Call
        </button>
        
        <button
          onClick={endCall}
          disabled={callStatus !== 'ACTIVE'}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          End Call
        </button>
        
        <button
          onClick={clearMessages}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Log
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Messages Log */}
      <div className="bg-black text-green-400 rounded-lg p-4 font-mono text-sm">
        <h3 className="text-white mb-2">Test Log:</h3>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-gray-500">No messages yet...</div>
          )}
          {messages.map((message, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {new Date().toLocaleTimeString()} - {message}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-yellow-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Testing Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure all environment variables are set (check above)</li>
          <li>Click "Test Basic Call" to test simple Vapi connection</li>
          <li>Click "Test Interview Call" to test with variables and interview setup</li>
          <li>Speak into your microphone when the call is active</li>
          <li>Watch the log for transcripts and status updates</li>
          <li>Click "End Call" when done testing</li>
        </ol>
      </div>

      {/* Vapi Debug Test */}
      <VapiDebugTest />

      {/* Assistant Validator */}
      <VapiAssistantValidator />

      {/* Encryption System Test */}
      <EncryptionSystemTest />
    </div>
  );
}
