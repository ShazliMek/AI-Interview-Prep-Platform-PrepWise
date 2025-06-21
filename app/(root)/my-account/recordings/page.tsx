'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import vapiEncryptionService from '@/lib/services/vapiEncryptionService';

interface Recording {
  id: string;
  interviewId: string;
  createdAt: string;
  expiresAt: string;
  metadata: {
    duration: number;
    fileSize: number;
    mimeType: string;
  }
}

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [stopPlayback, setStopPlayback] = useState<(() => void) | null>(null);
  
  useEffect(() => {
    fetchRecordings();
  }, []);
  
  const fetchRecordings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user/recordings');
      const data = await response.json();
      
      if (data.success) {
        setRecordings(data.recordings);
      } else {
        setError(data.message || 'Failed to load recordings');
      }
    } catch (err) {
      setError('Error loading recordings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePlay = async (recordingId: string) => {
    // Stop any current playback
    if (stopPlayback) {
      stopPlayback();
      setStopPlayback(null);
      
      // If we're stopping the current recording, just return
      if (playingId === recordingId) {
        setPlayingId(null);
        return;
      }
    }
    
    try {
      setPlayingId(recordingId);
      const cleanup = await vapiEncryptionService.playEncryptedRecording(recordingId);
      setStopPlayback(() => cleanup);
    } catch (error) {
      console.error('Error playing recording:', error);
      setPlayingId(null);
    }
  };
  
  const handleDelete = async (recordingId: string) => {
    if (!confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Stop playback if this is the recording being played
      if (playingId === recordingId && stopPlayback) {
        stopPlayback();
        setStopPlayback(null);
        setPlayingId(null);
      }
      
      const response = await fetch(`/api/user/recordings?id=${recordingId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from list
        setRecordings(recordings.filter(r => r.id !== recordingId));
      } else {
        throw new Error(data.message || 'Failed to delete recording');
      }
    } catch (err) {
      console.error('Error deleting recording:', err);
      alert('Failed to delete recording');
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Voice Recordings</h1>
          <Link href="/my-account" className="text-sm text-blue-500 hover:text-blue-600">
            Back to Account
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <p className="text-center py-8">Loading your recordings...</p>
        ) : recordings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You don't have any encrypted voice recordings yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Voice recordings will appear here after you complete interview sessions.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-medium">Encrypted Voice Recordings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All recordings are automatically deleted after 30 days
              </p>
            </div>
            
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recordings.map((recording) => (
                <li key={recording.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Interview recording</p>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>Created: {formatDate(recording.createdAt)}</p>
                        <p>Expires: {formatDate(recording.expiresAt)}</p>
                        <p>Size: {formatFileSize(recording.metadata.fileSize)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={playingId === recording.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePlay(recording.id)}
                      >
                        {playingId === recording.id ? 'Stop' : 'Play'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(recording.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
