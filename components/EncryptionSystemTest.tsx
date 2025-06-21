"use client";

import { useState } from 'react';

export default function EncryptionSystemTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const runFullSystemTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult("🔄 Starting comprehensive encryption system test...");

    try {
      // Test 1: Check API endpoints exist
      addResult("📡 Testing API endpoints...");
      
      // Test privacy settings API
      try {
        const privacyResponse = await fetch('/api/user/privacy');
        if (privacyResponse.ok) {
          addResult("✅ Privacy settings API: Working");
          const privacyData = await privacyResponse.json();
          addResult(`   └─ Default retention: ${privacyData.settings?.dataRetentionPeriod || 'Unknown'} days`);
        } else {
          addResult(`❌ Privacy settings API: Failed (${privacyResponse.status})`);
        }
      } catch (error) {
        addResult(`❌ Privacy settings API: Error - ${error}`);
      }

      // Test recordings API
      try {
        const recordingsResponse = await fetch('/api/user/recordings');
        if (recordingsResponse.ok) {
          addResult("✅ Recordings API: Working");
          const recordingsData = await recordingsResponse.json();
          addResult(`   └─ Current recordings: ${recordingsData.recordings?.length || 0}`);
        } else {
          addResult(`❌ Recordings API: Failed (${recordingsResponse.status})`);
        }
      } catch (error) {
        addResult(`❌ Recordings API: Error - ${error}`);
      }

      // Test user current API
      try {
        const userResponse = await fetch('/api/user/current');
        if (userResponse.ok) {
          addResult("✅ User API: Working");
          const userData = await userResponse.json();
          addResult(`   └─ User: ${userData.user?.name || 'Unknown'}`);
        } else {
          addResult(`❌ User API: Failed (${userResponse.status})`);
        }
      } catch (error) {
        addResult(`❌ User API: Error - ${error}`);
      }

      // Test 2: Test browser recording capabilities
      addResult("🎤 Testing browser recording capabilities...");
      
      if (!navigator.mediaDevices) {
        addResult("❌ MediaDevices API: Not supported");
      } else {
        addResult("✅ MediaDevices API: Supported");
        
        try {
          // Test microphone access
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          addResult("✅ Microphone access: Granted");
          
          // Test MediaRecorder
          if (MediaRecorder.isTypeSupported('audio/webm')) {
            addResult("✅ WebM recording: Supported");
          } else {
            addResult("⚠️ WebM recording: Not supported, will try alternatives");
          }
          
          // Create and test MediaRecorder
          const mediaRecorder = new MediaRecorder(stream);
          addResult("✅ MediaRecorder: Created successfully");
          
          // Stop the stream
          stream.getTracks().forEach(track => track.stop());
          addResult("✅ Audio stream: Properly closed");
          
        } catch (error) {
          addResult(`❌ Microphone access: Denied or error - ${error}`);
        }
      }

      // Test 3: Test encryption utilities
      addResult("🔐 Testing encryption utilities...");
      
      try {
        // Test Web Crypto API
        if (window.crypto && window.crypto.subtle) {
          addResult("✅ Web Crypto API: Available");
          
          // Test AES key generation
          const key = await window.crypto.subtle.generateKey(
            {
              name: "AES-GCM",
              length: 256,
            },
            true,
            ["encrypt", "decrypt"]
          );
          addResult("✅ AES-256 key generation: Working");
          
          // Test encryption/decryption
          const testData = new TextEncoder().encode("Test encryption data");
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          
          const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            testData
          );
          addResult("✅ AES encryption: Working");
          
          const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encrypted
          );
          
          const decryptedText = new TextDecoder().decode(decrypted);
          if (decryptedText === "Test encryption data") {
            addResult("✅ AES decryption: Working");
          } else {
            addResult("❌ AES decryption: Failed - data mismatch");
          }
          
        } else {
          addResult("❌ Web Crypto API: Not available");
        }
      } catch (error) {
        addResult(`❌ Encryption test: Error - ${error}`);
      }

      // Test 4: Test Firebase connectivity with detailed diagnostics
      addResult("🔥 Testing Firebase connectivity...");
      
      try {
        const diagnosticsResponse = await fetch('/api/diagnostics');
        
        if (diagnosticsResponse.ok) {
          const diagnostics = await diagnosticsResponse.json();
          addResult(`✅ Diagnostics API: Working`);
          addResult(`   └─ Auth: ${diagnostics.tests.auth}`);
          addResult(`   └─ Firebase: ${diagnostics.tests.firebase}`);
          addResult(`   └─ Firestore: ${diagnostics.tests.firestore}`);
          addResult(`   └─ Storage: ${diagnostics.tests.storage}`);
          addResult(`   └─ User: ${diagnostics.user?.name || 'Unknown'}`);
          
          // Check specific issues
          if (diagnostics.tests.storage.includes('ERROR')) {
            addResult(`❌ Storage Error Details: ${diagnostics.tests.storage}`);
          }
          if (diagnostics.tests.firestore.includes('ERROR')) {
            addResult(`❌ Firestore Error Details: ${diagnostics.tests.firestore}`);
          }
        } else {
          addResult(`❌ Diagnostics API: Failed (${diagnosticsResponse.status})`);
          const errorText = await diagnosticsResponse.text();
          addResult(`   └─ Error: ${errorText}`);
        }
      } catch (error) {
        addResult(`❌ Diagnostics connectivity: Error - ${error}`);
      }

      addResult("🎯 Test Summary:");
      const successCount = testResults.filter(r => r.includes("✅")).length;
      const errorCount = testResults.filter(r => r.includes("❌")).length;
      const warningCount = testResults.filter(r => r.includes("⚠️")).length;
      
      addResult(`   Success: ${successCount} | Errors: ${errorCount} | Warnings: ${warningCount}`);
      
      if (errorCount === 0) {
        addResult("🎉 All core systems operational!");
      } else {
        addResult("🔧 Some systems need attention - see errors above");
      }

    } catch (error) {
      addResult(`💥 Test suite crashed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const testRecordingFlow = async () => {
    setTestResults([]);
    addResult("🎬 Testing complete recording flow...");
    
    try {
      // Step 1: Start recording
      addResult("1️⃣ Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      addResult("2️⃣ Creating MediaRecorder...");
      const chunks: Blob[] = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      addResult("3️⃣ Starting 3-second test recording...");
      mediaRecorder.start();
      
      // Record for 3 seconds
      setTimeout(() => {
        mediaRecorder.stop();
        
        mediaRecorder.onstop = async () => {
          addResult("4️⃣ Recording stopped, processing audio...");
          
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          addResult(`5️⃣ Audio blob created: ${audioBlob.size} bytes`);
          
          // Convert to array buffer (what we'd encrypt)
          const arrayBuffer = await audioBlob.arrayBuffer();
          addResult(`6️⃣ Array buffer: ${arrayBuffer.byteLength} bytes`);
          
          // Test encryption simulation
          if (window.crypto && window.crypto.subtle) {
            const key = await window.crypto.subtle.generateKey(
              { name: "AES-GCM", length: 256 },
              true,
              ["encrypt", "decrypt"]
            );
            
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encrypted = await window.crypto.subtle.encrypt(
              { name: "AES-GCM", iv: iv },
              key,
              arrayBuffer
            );
            
            addResult(`7️⃣ ✅ Audio encrypted: ${encrypted.byteLength} bytes`);
            addResult("8️⃣ ✅ Complete recording → encryption flow tested!");
          }
          
          // Clean up
          stream.getTracks().forEach(track => track.stop());
          addResult("9️⃣ ✅ Audio stream cleaned up");
        };
      }, 3000);
      
    } catch (error) {
      addResult(`❌ Recording test failed: ${error}`);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Encryption System Status Test</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={runFullSystemTest}
            disabled={isRunning}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isRunning ? 'Testing...' : 'Test All Systems'}
          </button>
          
          <button
            onClick={testRecordingFlow}
            disabled={isRunning}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Recording Flow
          </button>
          
          <button
            onClick={() => setTestResults([])}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Results
          </button>
        </div>
        
        <div className="bg-black text-green-400 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <div className="text-gray-500">Click "Test All Systems" to check encryption functionality...</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {result}
              </div>
            ))
          )}
        </div>
        
        <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
          <strong>What this tests:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>All API endpoints for privacy and recordings</li>
            <li>Browser audio recording capabilities</li>
            <li>Web Crypto API for encryption/decryption</li>
            <li>Complete recording → encryption flow</li>
            <li>Firebase connectivity through APIs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
