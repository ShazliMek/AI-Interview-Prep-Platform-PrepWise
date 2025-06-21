'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnalysisReportCard from '@/components/AnalysisReportCard';

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

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

interface AnalysisResult {
  clarity: { filler_word_count: number };
  confidence_metrics: { pitch_stability_score: number };
  pace: number;
  transcript?: string;
  tone?: { label: string; confidence: number };
  duration_seconds?: number;
}

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioStates, setAudioStates] = useState<Record<string, AudioState>>({});
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzedRecordingId, setAnalyzedRecordingId] = useState<string | null>(null);
  
  useEffect(() => {
    fetchRecordings();
  }, []);

  // Cleanup audio elements when component unmounts
  useEffect(() => {
    return () => {
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [audioElements]);
  
  const fetchRecordings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check authentication first
      const authResponse = await fetch('/api/user/current');
      const authData = await authResponse.json();
      
      if (!authData.success) {
        setError('Please sign in to view your recordings.');
        return;
      }
      
      // Try MongoDB endpoint first, fallback to Firebase
      let response = await fetch('/api/user/recordings-mongodb');
      let data = await response.json();
      
      if (!data.success) {
        // Fallback to Firebase endpoint
        console.log('MongoDB endpoint failed, trying Firebase fallback...');
        response = await fetch('/api/user/recordings');
        data = await response.json();
      }
      
      if (data.success) {
        setRecordings(data.recordings);
        
        // Initialize audio states for all recordings
        const newAudioStates: Record<string, AudioState> = {};
        data.recordings.forEach((recording: Recording) => {
          newAudioStates[recording.id] = {
            isPlaying: false,
            currentTime: 0,
            duration: recording.metadata.duration || 0, // Use metadata duration as fallback
            isLoading: false
          };
        });
        setAudioStates(newAudioStates);
        
        console.log(`Loaded ${data.recordings.length} recordings from ${data.storage || 'database'}`);
      } else {
        if (data.message && data.message.includes('Unauthorized')) {
          setError('Please sign in to view your recordings.');
        } else {
          setError(data.message || 'Failed to load recordings');
        }
      }
    } catch (err) {
      setError('Error loading recordings - please check your connection and try again');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const initializeAudioState = (recordingId: string) => {
    if (!audioStates[recordingId]) {
      const recording = recordings.find(r => r.id === recordingId);
      setAudioStates(prev => ({
        ...prev,
        [recordingId]: {
          isPlaying: false,
          currentTime: 0,
          duration: recording?.metadata.duration || 0,
          isLoading: false
        }
      }));
    }
  };

  const updateAudioState = (recordingId: string, updates: Partial<AudioState>) => {
    setAudioStates(prev => ({
      ...prev,
      [recordingId]: {
        ...prev[recordingId],
        ...updates
      }
    }));
  };

  const cleanupAudio = (recordingId: string) => {
    const audio = audioElements[recordingId];
    if (audio) {
      audio.pause();
      audio.src = '';
      URL.revokeObjectURL(audio.src);
    }
    
    setAudioElements(prev => {
      const newElements = { ...prev };
      delete newElements[recordingId];
      return newElements;
    });
    
    updateAudioState(recordingId, {
      isPlaying: false,
      currentTime: 0,
      isLoading: false
    });
    
    if (playingId === recordingId) {
      setPlayingId(null);
    }
  };

  const handlePlay = async (recordingId: string) => {
    try {
      console.log(`[HandlePlay] Starting for recording: ${recordingId}`);
      
      // Initialize state
      initializeAudioState(recordingId);
      
      // Check if we already have an audio element
      const existingAudio = audioElements[recordingId];
      if (existingAudio) {
        const currentState = audioStates[recordingId];
        if (currentState?.isPlaying) {
          console.log(`[HandlePlay] Pausing existing audio`);
          existingAudio.pause();
        } else {
          console.log(`[HandlePlay] Resuming existing audio`);
          await existingAudio.play();
          setPlayingId(recordingId);
        }
        return;
      }

      // Stop any other playing audio
      if (playingId && playingId !== recordingId) {
        cleanupAudio(playingId);
      }

      // Start loading
      updateAudioState(recordingId, { isLoading: true });
      setPlayingId(recordingId);

      // Fetch audio data
      let response = await fetch(`/api/user/recordings-mongodb/${recordingId}`);
      if (!response.ok) {
        response = await fetch(`/api/user/recordings/${recordingId}`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recording: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      if (audioBlob.size === 0) {
        throw new Error('Recording is empty');
      }
      
      // Create and setup audio
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Setup event listeners
      audio.addEventListener('loadedmetadata', () => {
        const duration = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : audioStates[recordingId]?.duration || 0;
        console.log(`[HandlePlay] Loaded metadata, duration: ${duration}s`);
        updateAudioState(recordingId, { duration, isLoading: false });
      });
      
      audio.addEventListener('timeupdate', () => {
        updateAudioState(recordingId, { currentTime: audio.currentTime });
      });
      
      audio.addEventListener('ended', () => {
        console.log(`[HandlePlay] Audio ended`);
        cleanupAudio(recordingId);
      });
      
      audio.addEventListener('pause', () => {
        updateAudioState(recordingId, { isPlaying: false });
      });

      audio.addEventListener('play', () => {
        updateAudioState(recordingId, { isPlaying: true });
      });

      audio.addEventListener('error', (e) => {
        console.error('[HandlePlay] Audio error:', e);
        cleanupAudio(recordingId);
      });

      // Store element and play
      setAudioElements(prev => ({ ...prev, [recordingId]: audio }));
      await audio.play();
      
    } catch (error) {
      console.error('[HandlePlay] Error:', error);
      updateAudioState(recordingId, { isPlaying: false, isLoading: false });
      setPlayingId(null);
      alert(`Playback failed: ${(error as Error).message}`);
    }
  };

  const handleSeek = (recordingId: string, newTime: number) => {
    const audio = audioElements[recordingId];
    const state = audioStates[recordingId];
    
    if (audio && state && state.duration > 0 && isFinite(newTime) && newTime >= 0 && newTime <= state.duration) {
      console.log(`[HandleSeek] Seeking to ${newTime}s for recording: ${recordingId}`);
      try {
        audio.currentTime = newTime;
        updateAudioState(recordingId, { currentTime: newTime });
      } catch (error) {
        console.error('[HandleSeek] Seek error:', error);
      }
    }
  };

  const handleAnalyze = async (recordingId: string) => {
    try {
      setAnalyzingId(recordingId);
      console.log(`[Analyze] Starting analysis for recording: ${recordingId}`);
      
      const response = await fetch('/api/user/recordings/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recordingId }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to analyze recording');
      }
      
      console.log(`[Analyze] Analysis completed:`, data.analysis);
      setAnalysisResult(data.analysis);
      setAnalyzedRecordingId(recordingId);
      
    } catch (error) {
      console.error('[Analyze] Error:', error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes('Authentication')) {
        alert('Please sign in to analyze recordings.');
      } else if (errorMessage.includes('not found')) {
        alert('Recording not found. It may have been deleted.');
      } else if (errorMessage.includes('unavailable')) {
        alert('Analysis service is currently unavailable. Please try again later.');
      } else {
        alert(`Analysis failed: ${errorMessage}`);
      }
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleCloseAnalysis = () => {
    setAnalysisResult(null);
    setAnalyzedRecordingId(null);
  };
  
  const handleDelete = async (recordingId: string) => {
    if (!confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Stop and cleanup audio if playing
      if (audioElements[recordingId]) {
        cleanupAudio(recordingId);
      }
      
      // Try MongoDB endpoint first, fallback to Firebase
      let response = await fetch(`/api/user/recordings-mongodb?id=${recordingId}`, {
        method: 'DELETE'
      });
      let data = await response.json();
      
      if (!data.success) {
        // Fallback to Firebase endpoint
        console.log('MongoDB delete failed, trying Firebase fallback...');
        response = await fetch(`/api/user/recordings?id=${recordingId}`, {
          method: 'DELETE'
        });
        data = await response.json();
      }
      
      if (data.success) {
        // Remove from list and clean up states
        setRecordings(recordings.filter(r => r.id !== recordingId));
        setAudioStates(prev => {
          const newStates = { ...prev };
          delete newStates[recordingId];
          return newStates;
        });
        console.log(`Recording ${recordingId} deleted successfully`);
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

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 2px 0 #555;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 2px 0 #555;
        }
      `}</style>
      
      {/* Show Analysis Result if Available */}
      {analysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Recording Analysis</h2>
              <Button variant="outline" size="sm" onClick={handleCloseAnalysis}>
                ✕ Close
              </Button>
            </div>
            <div className="p-4">
              <AnalysisReportCard 
                analysis={analysisResult} 
                onEndInterview={handleCloseAnalysis}
              />
            </div>
          </div>
        </div>
      )}
      
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
            {error.includes('sign in') && (
              <div className="mt-2">
                <Link href="/sign-in" className="text-sm text-blue-500 hover:text-blue-600 underline">
                  Sign in here
                </Link>
              </div>
            )}
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
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-2 bg-gray-100 text-xs">
                <strong>Debug:</strong> Playing: {playingId || 'none'} | States: {Object.keys(audioStates).length} | Elements: {Object.keys(audioElements).length}
              </div>
            )}
            
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
                        {process.env.NODE_ENV === 'development' && (
                          <p className="text-xs text-blue-600">
                            State: {audioStates[recording.id] ? 
                              `playing:${audioStates[recording.id].isPlaying} duration:${audioStates[recording.id].duration}s` : 
                              'none'} | HasElement: {!!audioElements[recording.id]}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      {/* Playback Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={audioStates[recording.id]?.isPlaying ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePlay(recording.id)}
                          disabled={audioStates[recording.id]?.isLoading}
                          className="min-w-[90px]"
                        >
                          {audioStates[recording.id]?.isLoading ? (
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              <span>Loading</span>
                            </div>
                          ) : audioStates[recording.id]?.isPlaying ? (
                            '⏸️ Pause'
                          ) : (
                            '▶️ Play'
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAnalyze(recording.id)}
                          disabled={analyzingId === recording.id}
                          className="min-w-[90px]"
                        >
                          {analyzingId === recording.id ? (
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              <span>Analyzing</span>
                            </div>
                          ) : (
                            '📊 Analyze'
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(recording.id)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>

                      {/* Progress Bar */}
                      {audioStates[recording.id] && (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{formatTime(audioStates[recording.id].currentTime)}</span>
                            <div className="flex-1 relative">
                              <input
                                type="range"
                                min="0"
                                max={Math.max(audioStates[recording.id].duration, 1)} // Prevent max=0
                                value={audioStates[recording.id].currentTime}
                                onChange={(e) => handleSeek(recording.id, parseFloat(e.target.value))}
                                disabled={audioStates[recording.id].duration <= 0}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
                                style={{
                                  background: audioStates[recording.id].duration > 0 ? 
                                    `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                                      (audioStates[recording.id].currentTime / audioStates[recording.id].duration) * 100
                                    }%, #E5E7EB ${
                                      (audioStates[recording.id].currentTime / audioStates[recording.id].duration) * 100
                                    }%, #E5E7EB 100%)` : 
                                    '#E5E7EB'
                                }}
                              />
                            </div>
                            <span>
                              {audioStates[recording.id].duration > 0 
                                ? formatTime(audioStates[recording.id].duration)
                                : formatTime(recording.metadata.duration)
                              }
                            </span>
                          </div>
                        </div>
                      )}
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
