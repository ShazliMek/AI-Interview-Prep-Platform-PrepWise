'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface RecordingWithDetails {
  id: string;
  userId: string;
  interviewId: string;
  processingStatus: string;
  createdAt: string;
  expiresAt: string;
  metadata: {
    duration: number;
    fileSize: number;
    mimeType: string;
    originalFileName?: string;
    storageType?: string;
    quality?: string;
    interviewType?: string;
    notes?: string;
  }
}

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

export default function EnhancedRecordingsView() {
  const [recordings, setRecordings] = useState<RecordingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioStates, setAudioStates] = useState<Record<string, AudioState>>({});
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});
  const [stats, setStats] = useState({
    total: 0,
    totalSize: 0,
    totalDuration: 0,
    storageType: 'unknown'
  });

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try MongoDB first, fallback to Firebase
      let response = await fetch('/api/user/recordings-mongodb');
      let data = await response.json();
      
      if (!data.success) {
        response = await fetch('/api/user/recordings');
        data = await response.json();
      }
      
      if (data.success) {
        setRecordings(data.recordings);
        
        // Calculate stats
        const total = data.recordings.length;
        const totalSize = data.recordings.reduce((sum: number, r: RecordingWithDetails) => 
          sum + (r.metadata.fileSize || 0), 0);
        const totalDuration = data.recordings.reduce((sum: number, r: RecordingWithDetails) => 
          sum + (r.metadata.duration || 0), 0);
        const storageType = data.recordings[0]?.metadata?.storageType || 'unknown';
        
        setStats({ total, totalSize, totalDuration, storageType });
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

  const handleDelete = async (recordingId: string) => {
    if (!confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
      return;
    }
    
    try {
      let response = await fetch(`/api/user/recordings-mongodb?id=${recordingId}`, {
        method: 'DELETE'
      });
      let data = await response.json();
      
      if (!data.success) {
        response = await fetch(`/api/user/recordings?id=${recordingId}`, {
          method: 'DELETE'
        });
        data = await response.json();
      }
      
      if (data.success) {
        setRecordings(recordings.filter(r => r.id !== recordingId));
        await fetchRecordings(); // Refresh stats
      } else {
        throw new Error(data.message || 'Failed to delete recording');
      }
    } catch (err) {
      console.error('Error deleting recording:', err);
      alert('Failed to delete recording');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Voice Recordings</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Recordings</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Duration</p>
            <p className="text-2xl font-bold text-green-600">{formatDuration(stats.totalDuration)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Storage Used</p>
            <p className="text-2xl font-bold text-purple-600">{formatFileSize(stats.totalSize)}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Storage Type</p>
            <p className="text-2xl font-bold text-orange-600 capitalize">{stats.storageType}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchRecordings} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      {recordings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recordings yet</h3>
          <p className="text-gray-500 mb-4">Start an interview to create your first voice recording</p>
          <Button asChild>
            <a href="/interview">Start Interview</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div key={recording.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Interview: {recording.interviewId}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      recording.processingStatus === 'processed' 
                        ? 'bg-green-100 text-green-800'
                        : recording.processingStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {recording.processingStatus}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <p className="font-medium">Duration</p>
                      <p>{formatDuration(recording.metadata.duration)}</p>
                    </div>
                    <div>
                      <p className="font-medium">File Size</p>
                      <p>{formatFileSize(recording.metadata.fileSize)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Created</p>
                      <p>{new Date(recording.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Expires</p>
                      <p>{new Date(recording.expiresAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {recording.metadata.interviewType && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">Type: </span>
                      <span className="text-sm font-medium capitalize">{recording.metadata.interviewType}</span>
                    </div>
                  )}

                  {recording.metadata.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Notes: {recording.metadata.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      alert('Enhanced playback functionality is available on the main recordings page at /my-account/recordings');
                    }}
                  >
                    📱 Play
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(recording.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
