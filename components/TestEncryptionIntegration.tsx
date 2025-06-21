"use client";

import { useState } from 'react';

export default function TestEncryptionIntegration() {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState<string>('Ready');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      setStatus('Starting encrypted recording...');
      setRecording(true);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setStatus('Recording stopped. Processing...');
        
        // Here we would normally encrypt and store the audio
        // For testing, we'll just simulate it
        setTimeout(() => {
          setStatus('Recording encrypted and stored successfully');
        }, 1000);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setStatus('Recording... Speak now!');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setStatus(`Error: ${error}`);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setRecording(false);
    setStatus('Stopping recording...');
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Test Browser Audio Recording</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Recording:</strong> {recording ? 'Active' : 'Inactive'}</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={startRecording}
            disabled={recording}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Start Test Recording
          </button>
          
          <button
            onClick={stopRecording}
            disabled={!recording}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            Stop Recording
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>This test simulates browser-based audio recording:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Browser requests microphone access</li>
            <li>Audio is captured using MediaRecorder API</li>
            <li>Audio chunks are collected in memory</li>
            <li>When stopped, audio would be encrypted and stored</li>
            <li>This is what happens during actual Vapi calls</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
