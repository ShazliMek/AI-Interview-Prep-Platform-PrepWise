'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TestEncryptionPage() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  
  // Upload sample data to test encryption
  const handleUploadTest = async () => {
    setStatus('uploading');
    setErrorMessage(null);
    
    try {
      // Create a sample text buffer to simulate voice data
      const sampleData = new TextEncoder().encode(
        "This is a test voice recording to verify the encryption system works correctly."
      );
      
      // Convert buffer to base64 for transmission
      const base64Data = btoa(
        new Uint8Array(sampleData).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      // Send to server for encryption and storage
      const response = await fetch('/api/test-encryption/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: base64Data,
          metadata: {
            duration: 30,
            fileSize: sampleData.byteLength,
            mimeType: 'text/plain'
          }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setRecordingId(result.recordingId);
      } else {
        throw new Error(result.message || 'Failed to encrypt and store test data');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      console.error(error);
    }
  };
  
  // Fetch and decrypt the test data
  const handleFetchTest = async () => {
    if (!recordingId) return;
    
    setStatus('uploading'); // Reusing status for fetch operation
    setErrorMessage(null);
    setDecryptedText(null);
    
    try {
      const response = await fetch(`/api/test-encryption/retrieve?id=${recordingId}`);
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        // Convert the binary data to text
        setDecryptedText(result.data);
      } else {
        throw new Error(result.message || 'Failed to retrieve and decrypt test data');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      console.error(error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Test Encryption System</h1>
          <Link href="/my-account" className="text-sm text-blue-500 hover:text-blue-600">
            Back to Account
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Encryption Test Tool</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This page lets you verify that the voice recording encryption system is working properly.
            It will create a sample "recording" (text data), encrypt it, store it, and then retrieve and decrypt it.
          </p>
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {errorMessage}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Button
              onClick={handleUploadTest}
              disabled={status === 'uploading'}
              className="flex-1"
            >
              {status === 'uploading' ? 'Processing...' : 'Create & Encrypt Test Data'}
            </Button>
            
            <Button
              onClick={handleFetchTest}
              disabled={!recordingId || status === 'uploading'}
              variant="outline"
              className="flex-1"
            >
              Retrieve & Decrypt Test Data
            </Button>
          </div>
          
          {recordingId && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Recording ID:</h3>
              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{recordingId}</code>
            </div>
          )}
          
          {decryptedText && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-lg font-medium mb-3">Decrypted Content:</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm">{decryptedText}</pre>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-md">
                <p className="font-medium">Success!</p>
                <p className="text-sm">The encryption and decryption system is working correctly.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
