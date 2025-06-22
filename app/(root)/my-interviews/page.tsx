'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import AnalysisReportCard from '@/components/AnalysisReportCard';
import Link from 'next/link';

interface Recording {
  id: string;
  interviewId: string;
  createdAt: string;
  expiresAt: string;
  rec_length: number; // Duration from visual timer during recording
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

export default function MyInterviewsPage() {
  const searchParams = useSearchParams();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioStates, setAudioStates] = useState<Record<string, AudioState>>({});
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult>>({});
  const [analyzedRecordings, setAnalyzedRecordings] = useState<Set<string>>(new Set());
  const [showAnalysisDialog, setShowAnalysisDialog] = useState<string | null>(null);
  
  const smoothUpdateTimers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    fetchRecordings();
    
    return () => {
      Object.values(smoothUpdateTimers.current).forEach(timer => {
        clearInterval(timer);
      });
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  // Simple audio elements setup when recordings are loaded
  useEffect(() => {
    if (recordings.length > 0) {
      setupAudioElements();
    }
  }, [recordings]);



  const fetchRecordings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authResponse = await fetch('/api/user/current');
      const authData = await authResponse.json();
      
      if (!authData.success) {
        setError('Please sign in to view your recordings.');
        setLoading(false);
        return;
      }
      
      let response = await fetch('/api/user/recordings-mongodb');
      
      if (!response.ok) {
        console.log('MongoDB failed, trying Firebase fallback...');
        response = await fetch('/api/user/recordings');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Handle duration override from URL to fix redirect race condition
        const newInterviewId = searchParams.get('newInterviewId');
        const durationStr = searchParams.get('duration');
        let recordingsData = data.recordings;

        if (newInterviewId && durationStr) {
          const duration = parseInt(durationStr, 10);
          recordingsData = recordingsData.map((rec: Recording) => {
            if (rec.interviewId === newInterviewId && rec.rec_length === 0) {
              console.log(`[Duration Override] Correcting duration for new interview ${newInterviewId} from 0 to ${duration}s.`);
              return { ...rec, rec_length: duration };
            }
            return rec;
          });
        }

        setRecordings(recordingsData);
        
        // 🎯 LOG REC_LENGTH VALUES FOR ALL RECORDINGS
        console.log(`[REC_LENGTH] ===== RECORDING DURATIONS FROM DATABASE =====`);
        console.log(`[REC_LENGTH] Found ${data.recordings.length} recordings:`);
        data.recordings.forEach((recording: Recording, index: number) => {
          console.log(`[REC_LENGTH] ${index + 1}. Recording ${recording.id}:`);
          console.log(`[REC_LENGTH]    - Interview ID: ${recording.interviewId}`);
          console.log(`[REC_LENGTH]    - rec_length: ${recording.rec_length}s (${formatTime(recording.rec_length || 0)})`);
          console.log(`[REC_LENGTH]    - Created: ${recording.createdAt}`);
          console.log(`[REC_LENGTH]    ---`);
        });
        console.log(`[REC_LENGTH] ===== END REC_LENGTH DISPLAY =====`);
        
        const newAudioStates: Record<string, AudioState> = {};
        data.recordings.forEach((recording: Recording) => {
          // Use rec_length first, fall back to metadata.duration if not available
          const duration = recording.rec_length > 0 ? recording.rec_length : (recording.metadata?.duration || 0);
          console.log(`[Audio Setup] Setting up recording ${recording.id} with duration: ${duration}s (rec_length: ${recording.rec_length}, metadata.duration: ${recording.metadata?.duration})`);
          
          newAudioStates[recording.id] = {
            isPlaying: false,
            currentTime: 0,
            duration: duration,
            isLoading: false
          };
        });
        setAudioStates(newAudioStates);
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

  const setupAudioElements = () => {
    console.log(`[Audio Setup] Setting up audio elements for ${recordings.length} recordings...`);
    
    const newAudioElements: Record<string, HTMLAudioElement> = {};
    const newAudioStates: Record<string, AudioState> = {};

    recordings.forEach(recording => {
      // Create audio element for playback
      const audio = new Audio();
      audio.src = getAudioUrl(recording.id);
      audio.preload = 'none'; // Don't preload since we only need it for playback
      
      newAudioElements[recording.id] = audio;
      newAudioStates[recording.id] = {
        isPlaying: false,
        currentTime: 0,
        duration: recording.rec_length, // Use stored duration from database
        isLoading: false
      };
      
      console.log(`[Audio Setup] Setup audio for ${recording.id}, stored duration: ${recording.rec_length}s`);
    });

    setAudioElements(newAudioElements);
    setAudioStates(newAudioStates);
    
    console.log(`[Audio Setup] ✅ Audio elements setup complete for ${recordings.length} recordings`);
  };

  // Helper function to get audio URL for a recording
  const getAudioUrl = (recordingId: string): string => {
    // MongoDB recordings are served through the MongoDB API endpoint
    const audioUrl = `/api/user/recordings-mongodb/${recordingId}`;
    console.log(`[Audio Setup] Generated MongoDB audio URL: ${audioUrl}`);
    return audioUrl;
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

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePlay = async (recordingId: string) => {
    try {
      console.log(`[Audio] Starting playback for recording: ${recordingId}`);
      
      const existingAudio = audioElements[recordingId];
      if (existingAudio) {
        const currentState = audioStates[recordingId];
        if (currentState?.isPlaying) {
          console.log(`[Audio] Pausing audio for recording: ${recordingId}`);
          existingAudio.pause();
          updateAudioState(recordingId, { isPlaying: false });
          setPlayingId(null);
          return;
        } else {
          try {
            console.log(`[Audio] Resuming audio for recording: ${recordingId}`);
            await existingAudio.play();
            updateAudioState(recordingId, { isPlaying: true });
            setPlayingId(recordingId);
          } catch (playError) {
            console.error(`[Audio] Resume error for ${recordingId}:`, playError);
            cleanupAudio(recordingId);
          }
        }
        return;
      }

      // Stop any other playing audio
      if (playingId && playingId !== recordingId) {
        console.log(`[Audio] Stopping currently playing audio: ${playingId}`);
        const currentAudio = audioElements[playingId];
        if (currentAudio) {
          currentAudio.pause();
          updateAudioState(playingId, { isPlaying: false });
        }
        setPlayingId(null);
      }

      // Set loading state
      console.log(`[Audio] Setting loading state for recording: ${recordingId}`);
      updateAudioState(recordingId, { isLoading: true });

      // Fetch audio data
      console.log(`[Audio] Fetching audio data for recording: ${recordingId}`);
      let response = await fetch(`/api/user/recordings-mongodb/${recordingId}`);
      if (!response.ok) {
        console.log(`[Audio] MongoDB fetch failed, trying Firebase fallback for recording: ${recordingId}`);
        response = await fetch(`/api/user/recordings/${recordingId}`);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch recording: ${response.status}`);
      }

      console.log(`[Audio] Successfully fetched audio data for recording: ${recordingId}`);
      const audioBlob = await response.blob();
      console.log(`[Audio] Audio blob size: ${audioBlob.size} bytes for recording: ${recordingId}`);
      
      if (audioBlob.size === 0) {
        throw new Error('Recording is empty');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      console.log(`[Audio] Created audio element for recording: ${recordingId}`);

      // Setup audio event listeners
      audio.addEventListener('loadstart', () => {
        console.log(`[Audio] Load started for recording: ${recordingId}`);
      });

      audio.addEventListener('loadedmetadata', () => {
        console.log(`[Audio] Metadata loaded for recording: ${recordingId}, duration: ${audio.duration}s`);
        if (isFinite(audio.duration) && audio.duration > 0) {
          updateAudioState(recordingId, { 
            duration: audio.duration,
            isLoading: false 
          });
          console.log(`[Audio] Duration updated to ${audio.duration}s for recording: ${recordingId}`);
        }
      });

      audio.addEventListener('loadeddata', () => {
        console.log(`[Audio] Data loaded for recording: ${recordingId}`);
        // Only clear loading if we have duration metadata
        const currentState = audioStates[recordingId];
        if (currentState?.duration && currentState.duration > 0) {
          updateAudioState(recordingId, { isLoading: false });
        }
      });

      audio.addEventListener('canplay', () => {
        console.log(`[Audio] Can play recording: ${recordingId}`);
        // Only clear loading if we have duration metadata
        const currentState = audioStates[recordingId];
        if (currentState?.duration && currentState.duration > 0) {
          updateAudioState(recordingId, { isLoading: false });
        }
      });

      audio.addEventListener('timeupdate', () => {
        if (isFinite(audio.currentTime)) {
          updateAudioState(recordingId, { 
            currentTime: audio.currentTime,
            ...(isFinite(audio.duration) && audio.duration > 0.1 ? { duration: audio.duration } : {})
          });
        }
      });

      audio.addEventListener('ended', () => {
        console.log(`[Audio] Playback ended for recording: ${recordingId}`);
        updateAudioState(recordingId, { 
          isPlaying: false, 
          currentTime: 0 
        });
        setPlayingId(null);
      });

      audio.addEventListener('pause', () => {
        console.log(`[Audio] Paused recording: ${recordingId}`);
        updateAudioState(recordingId, { isPlaying: false });
        if (playingId === recordingId) {
          setPlayingId(null);
        }
      });

      audio.addEventListener('play', () => {
        console.log(`[Audio] Started playing recording: ${recordingId}`);
        // Ensure we have duration before clearing loading state
        const currentDuration = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (audioStates[recordingId]?.duration || 0);
        updateAudioState(recordingId, { 
          isPlaying: true,
          isLoading: false, // Clear loading state when play starts
          ...(currentDuration > 0 ? { duration: currentDuration } : {})
        });
        setPlayingId(recordingId);
      });

      audio.addEventListener('error', (e) => {
        console.error(`[Audio] Audio error for recording ${recordingId}:`, e);
        updateAudioState(recordingId, { 
          isPlaying: false, 
          isLoading: false 
        });
        setPlayingId(null);
        URL.revokeObjectURL(audioUrl);
      });

      setAudioElements(prev => ({ ...prev, [recordingId]: audio }));
      
      try {
        console.log(`[Audio] Attempting to play recording: ${recordingId}`);
        
        // Wait for metadata to load if not already loaded
        if (!isFinite(audio.duration) || audio.duration <= 0) {
          console.log(`[Audio] Waiting for metadata to load for recording: ${recordingId}`);
          await new Promise<void>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error('Timeout waiting for audio metadata'));
            }, 10000); // 10 second timeout
            
            const onMetadataLoaded = () => {
              if (isFinite(audio.duration) && audio.duration > 0) {
                console.log(`[Audio] Metadata loaded, duration: ${audio.duration}s for recording: ${recordingId}`);
                updateAudioState(recordingId, { duration: audio.duration });
                clearTimeout(timeoutId);
                resolve();
              }
            };
            
            if (isFinite(audio.duration) && audio.duration > 0) {
              clearTimeout(timeoutId);
              resolve();
            } else {
              audio.addEventListener('loadedmetadata', onMetadataLoaded, { once: true });
            }
          });
        }
        
        await audio.play();
        console.log(`[Audio] Successfully started playback for recording: ${recordingId}`);
        // Loading state will be cleared by the 'play' event listener
      } catch (playError) {
        console.error(`[Audio] Play error for recording ${recordingId}:`, playError);
        updateAudioState(recordingId, { isPlaying: false, isLoading: false });
        setPlayingId(null);
        throw playError;
      }

    } catch (error) {
      console.error(`[Audio] Error in handlePlay for recording ${recordingId}:`, error);
      updateAudioState(recordingId, { isPlaying: false, isLoading: false });
      setPlayingId(null);
      alert(`Playback failed: ${(error as Error).message}`);
    }
  };

  const handleSeek = (recordingId: string, newTime: number) => {
    const audio = audioElements[recordingId];
    const state = audioStates[recordingId];
    const duration = state?.duration || 0;
    
    if (duration > 0 && isFinite(newTime) && newTime >= 0 && newTime <= duration) {
      updateAudioState(recordingId, { currentTime: newTime });
      
      if (audio) {
        try {
          audio.currentTime = newTime;
        } catch (error) {
          console.error('[MyInterviews] Seek error:', error);
        }
      }
    }
  };

  const cleanupAudio = (recordingId: string) => {
    const audio = audioElements[recordingId];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      if (audio.src && audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
      }
      audio.src = '';
      audio.load();
    }
    
    setAudioElements(prev => {
      const newElements = { ...prev };
      delete newElements[recordingId];
      return newElements;
    });
    
    const currentState = audioStates[recordingId];
    updateAudioState(recordingId, {
      isPlaying: false,
      currentTime: 0,
      isLoading: false,
      duration: currentState?.duration || 0
    });
    
    if (playingId === recordingId) {
      setPlayingId(null);
    }
  };

  const handleAnalyze = async (recordingId: string) => {
    try {
      setAnalyzingId(recordingId);
      
      const response = await fetch('/api/user/recordings/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordingId })
      });
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setAnalysisResults(prev => ({
          ...prev,
          [recordingId]: result.analysis
        }));
        setAnalyzedRecordings(prev => new Set(prev).add(recordingId));
        setShowAnalysisDialog(recordingId);
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      alert(`Analysis failed: ${(error as Error).message}`);
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDelete = async (recordingId: string) => {
    if (!confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
      return;
    }
    
    try {
      console.log(`[Delete] Attempting to delete recording: ${recordingId}`);
      const response = await fetch(`/api/user/recordings-mongodb?id=${recordingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Delete] Delete failed: ${response.status} - ${errorText}`);
        throw new Error(`Delete failed: ${response.status}`);
      }
      
      console.log(`[Delete] ✅ Successfully deleted recording: ${recordingId}`);
      setRecordings(prev => prev.filter(r => r.id !== recordingId));
      cleanupAudio(recordingId);
      
      setAnalysisResults(prev => {
        const newResults = { ...prev };
        delete newResults[recordingId];
        return newResults;
      });
      setAnalyzedRecordings(prev => {
        const newSet = new Set(prev);
        newSet.delete(recordingId);
        return newSet;
      });
      
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Delete failed: ${(error as Error).message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchRecordings} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">My Interviews</h2>
            <p className="text-gray-600">
              View and manage your interview recordings and analysis
            </p>
          </div>
            <Button variant="outline" asChild>
              <Link href="/">← Back to Home</Link>
            </Button>
        </div>
      </div>

      {recordings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
            <p className="text-gray-500 mb-4">Start an interview to create your first recording</p>
            <Button asChild>
              <Link href="/interview">Start Interview</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {recordings.map((recording) => (
            <Card key={recording.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Interview: {recording.interviewId}</CardTitle>
                    <CardDescription>
                      {formatDate(recording.createdAt)}
                    </CardDescription>
                  </div>
                  <CardAction>
                    <span className="text-sm text-gray-500">
                      {formatTime(recording.rec_length )}
                    </span>
                  </CardAction>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
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
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="w-8 text-right">
                        {formatTime(audioStates[recording.id]?.currentTime || 0)}
                      </span>
                      <div className="flex-1">
                        <Slider
                          value={[audioStates[recording.id]?.currentTime || 0]}
                          max={recording.rec_length}
                          step={0.1}
                          onValueChange={(value) => handleSeek(recording.id, value[0])}
                          className="w-full"
                        />
                      </div>
                      <span className="w-8 text-left">
                        {formatTime(recording.rec_length || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="justify-between">
                <div className="flex space-x-2">
                  {analyzedRecordings.has(recording.id) ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          📊 View Analysis
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <div className="relative">
                          <button
                            onClick={() => {}}
                            className="absolute right-0 top-0 text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
                            aria-label="Close"
                          >
                            ×
                          </button>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Interview Analysis Report</AlertDialogTitle>
                            <AlertDialogDescription>
                              Detailed analysis of your interview performance
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="my-4">
                            {analysisResults[recording.id] && (
                              <AnalysisReportCard 
                                analysis={analysisResults[recording.id]} 
                                onEndInterview={() => {}}
                              />
                            )}
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                          </AlertDialogFooter>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAnalyze(recording.id)}
                      disabled={analyzingId === recording.id}
                      className="min-w-[120px]"
                    >
                      {analyzingId === recording.id ? (
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Analyzing</span>
                        </div>
                      ) : (
                        '📊 Analyze Recording'
                      )}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(recording.id)}
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {showAnalysisDialog && (
        <AlertDialog open={!!showAnalysisDialog} onOpenChange={() => setShowAnalysisDialog(null)}>
          <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setShowAnalysisDialog(null)}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600 text-xl leading-none p-1 z-10"
                aria-label="Close"
              >
                ×
              </button>
              <AlertDialogHeader>
                <AlertDialogTitle>Analysis Complete!</AlertDialogTitle>
                <AlertDialogDescription>
                  Your interview has been analyzed. Here are the results:
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                {analysisResults[showAnalysisDialog] && (
                  <AnalysisReportCard 
                    analysis={analysisResults[showAnalysisDialog]} 
                    onEndInterview={() => {}}
                  />
                )}
              </div>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowAnalysisDialog(null)}>
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
