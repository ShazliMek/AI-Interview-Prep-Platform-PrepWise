'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
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
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Trash2, BarChart2, Loader2, Star } from "lucide-react";

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

interface MyInterviewsProps {
  onBack?: () => void;
}

export default function MyInterviews({ onBack }: MyInterviewsProps) {
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
  
  // Ref to store update timers for smoother progress
  const smoothUpdateTimers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    fetchRecordings();
    
    // Cleanup function
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
      
      // Try MongoDB endpoint first, fallback to Firebase
      let response = await fetch('/api/user/recordings-mongodb');
      
      if (!response.ok) {
        console.log('MongoDB failed, trying Firebase fallback...');
        response = await fetch('/api/user/recordings');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRecordings(data.recordings);
        
        // Initialize audio states
        const newAudioStates: Record<string, AudioState> = {};
        data.recordings.forEach((recording: Recording) => {
          newAudioStates[recording.id] = {
            isPlaying: false,
            currentTime: 0,
            duration: recording.metadata.duration || 0,
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
      console.log(`[MyInterviews] Starting playback for recording: ${recordingId}`);
      
      const existingAudio = audioElements[recordingId];
      if (existingAudio) {
        const currentState = audioStates[recordingId];
        if (currentState?.isPlaying) {
          existingAudio.pause();
          updateAudioState(recordingId, { isPlaying: false });
          setPlayingId(null);
          return;
        } else {
          try {
            await existingAudio.play();
            updateAudioState(recordingId, { isPlaying: true });
            setPlayingId(recordingId);
          } catch (playError) {
            console.error(`[MyInterviews] Resume error:`, playError);
            cleanupAudio(recordingId);
          }
        }
        return;
      }

      // Stop any other playing audio
      if (playingId && playingId !== recordingId) {
        const currentAudio = audioElements[playingId];
        if (currentAudio) {
          currentAudio.pause();
          updateAudioState(playingId, { isPlaying: false });
        }
        setPlayingId(null);
      }

      updateAudioState(recordingId, { isLoading: true });

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

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Setup audio event listeners
      audio.addEventListener('loadedmetadata', () => {
        if (isFinite(audio.duration) && audio.duration > 0) {
          updateAudioState(recordingId, { 
            duration: audio.duration,
            isLoading: false 
          });
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
        updateAudioState(recordingId, { 
          isPlaying: false, 
          currentTime: 0 
        });
        setPlayingId(null);
      });

      audio.addEventListener('pause', () => {
        updateAudioState(recordingId, { isPlaying: false });
        if (playingId === recordingId) {
          setPlayingId(null);
        }
      });

      audio.addEventListener('play', () => {
        updateAudioState(recordingId, { isPlaying: true });
        setPlayingId(recordingId);
      });

      audio.addEventListener('error', (e) => {
        console.error('[MyInterviews] Audio error:', e);
        updateAudioState(recordingId, { 
          isPlaying: false, 
          isLoading: false 
        });
        setPlayingId(null);
        URL.revokeObjectURL(audioUrl);
      });

      // Store element and try to play
      setAudioElements(prev => ({ ...prev, [recordingId]: audio }));
      
      await audio.play();
      console.log(`[MyInterviews] Successfully started playback for ${recordingId}`);

    } catch (error) {
      console.error('[MyInterviews] Error:', error);
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
    // if (!confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
    //   return;
    // }
    
    try {
      const response = await fetch('/api/user/recordings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordingId })
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }
      
      // Remove from local state
      setRecordings(prev => prev.filter(r => r.id !== recordingId));
      cleanupAudio(recordingId);
      
      // Remove from analysis state
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
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              ← Back to Home
            </Button>
          )}
        </div>
      </div>

      {recordings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
            <p className="text-gray-500 mb-4">Start an interview to create your first recording</p>
            <Button asChild>
              <a href="/interview">Start Interview</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {recordings.map((recording) => {
            const audioState = audioStates[recording.id] || { isPlaying: false, currentTime: 0, duration: 0, isLoading: false };
            const isAnalyzed = analyzedRecordings.has(recording.id);
            const analysisResult = analysisResults[recording.id];

            return (
              <Card key={recording.id} className="w-full rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white shadow-2xl transition-all duration-300 hover:border-blue-400/40 hover:shadow-blue-500/10 backdrop-blur-sm">
                <CardHeader className="relative p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-gray-700/50 bg-gray-800 flex items-center justify-center">
                        <BarChart2 className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-white">
                          Interview Practice
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-400">
                          {new Date(recording.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-blue-500/50 bg-blue-900/30 text-blue-300">Completed</Badge>
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePlay(recording.id)}
                      disabled={audioState.isLoading}
                      className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 border-none text-white flex-shrink-0 transition-all transform hover:scale-110 flex items-center justify-center"
                    >
                      {audioState.isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : audioState.isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <div className="flex-1 space-y-1.5">
                      <Slider
                        value={[audioState.currentTime]}
                        max={audioState.duration || recording.metadata.duration || 1}
                        step={0.1}
                        onValueChange={(value) => handleSeek(recording.id, value[0])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{formatTime(audioState.currentTime)}</span>
                        <span>{formatTime(audioState.duration || recording.metadata.duration)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center px-6 pb-6">
                  <div className="flex items-center space-x-2 text-xs">
                    <Star size={14} className={`transition-colors ${isAnalyzed ? 'text-amber-400' : 'text-gray-600'}`} />
                    <span className={`font-medium transition-colors ${isAnalyzed ? 'text-white' : 'text-gray-500'}`}>
                      {isAnalyzed ? 'Analysis Ready' : 'Not Analyzed'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isAnalyzed ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white transition-all duration-200 px-3 py-2 text-sm font-semibold rounded-lg shadow-lg hover:shadow-green-500/25 transform hover:scale-105 flex items-center space-x-2">
                            <BarChart2 className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Interview Analysis Report</AlertDialogTitle>
                            <AlertDialogDescription>
                              Detailed analysis of your interview performance.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="my-4">
                            {analysisResult && (
                              <AnalysisReportCard 
                                analysis={analysisResult} 
                                onEndInterview={() => {}}
                              />
                            )}
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 border-none">Close</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAnalyze(recording.id)}
                        disabled={analyzingId === recording.id}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all duration-200 px-3 py-2 text-sm font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center space-x-2"
                      >
                        {analyzingId === recording.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <BarChart2 className="h-4 w-4" />
                        )}
                        <span>{analyzingId === recording.id ? 'Analyzing...' : 'Analyze'}</span>
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/50 w-9 h-9 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-900 text-white border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your interview recording and analysis. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 border-none">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(recording.id)} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Analysis Dialog */}
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
