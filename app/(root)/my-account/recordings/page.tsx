'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  const [loadingDurations, setLoadingDurations] = useState(false);
  // Ref to store update timers for smoother progress
  const smoothUpdateTimers = useRef<Record<string, NodeJS.Timeout>>({});
  
  useEffect(() => {
    fetchRecordings();
  }, []);

  // Function to get actual duration from audio file
  const getAudioDuration = async (recordingId: string): Promise<number> => {
    try {
      console.log(`[GetDuration] Fetching duration for ${recordingId}`);
      
      // Fetch audio data with proper error handling
      let response = await fetch(`/api/user/recordings-mongodb/${recordingId}`);
      if (!response.ok) {
        console.log(`[GetDuration] MongoDB failed for ${recordingId}, trying Firebase...`);
        response = await fetch(`/api/user/recordings/${recordingId}`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recording: ${response.status} ${response.statusText}`);
      }
      
      const audioBlob = await response.blob();
      console.log(`[GetDuration] Fetched blob for ${recordingId}: ${audioBlob.size} bytes`);
      
      if (audioBlob.size === 0) {
        throw new Error('Recording is empty');
      }
      
      // Create a temporary audio element to get duration
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        let resolved = false;
        
        const cleanup = () => {
          if (!resolved) {
            resolved = true;
            URL.revokeObjectURL(audioUrl);
          }
        };
        
        audio.addEventListener('loadedmetadata', () => {
          if (resolved) return;
          const duration = audio.duration;
          cleanup();
          console.log(`[GetDuration] SUCCESS - Found duration for ${recordingId}: ${duration}s`);
          // If duration is not a valid number or is very close to zero, use the fallback
          resolve(isFinite(duration) && duration > 0.1 ? duration : 60);
        });
        
        audio.addEventListener('loadeddata', () => {
          if (resolved) return;
          const duration = audio.duration;
          if (isFinite(duration) && duration > 0.1) {
            cleanup();
            console.log(`[GetDuration] SUCCESS via loadeddata - Found duration for ${recordingId}: ${duration}s`);
            resolve(duration);
          }
        });
        
        audio.addEventListener('error', (e) => {
          if (resolved) return;
          cleanup();
          console.error(`[GetDuration] ERROR loading audio for ${recordingId}:`, e);
          resolve(60); // Fallback to 60 seconds
        });
        
        // Timeout after 10 seconds (increased from 5)
        setTimeout(() => {
          if (resolved) return;
          cleanup();
          console.warn(`[GetDuration] TIMEOUT getting duration for ${recordingId}`);
          resolve(60);
        }, 10000);
        
        // Try to load the audio
        audio.load();
      });
    } catch (error) {
      console.error(`[GetDuration] Exception for ${recordingId}:`, error);
      return 60; // Fallback
    }
  };

  // Load actual durations for all recordings
  const loadActualDurations = async (recordingsToLoad: Recording[], currentAudioStates: Record<string, AudioState>) => {
    setLoadingDurations(true);
    console.log(`[LoadDurations] Loading actual durations for ${recordingsToLoad.length} recordings`);
    
    // Load durations in parallel for better performance
    const durationPromises = recordingsToLoad.map(async (recording) => {
      // Use the passed-in audio states to check if we need to load
      const currentState = currentAudioStates[recording.id];
      // Always try to get actual duration if we don't have a reliable one yet
      if (!currentState || currentState.duration <= 0 || recording.metadata.duration === 0) {
        try {
          const actualDuration = await getAudioDuration(recording.id);
          updateAudioState(recording.id, { duration: actualDuration });
          return { id: recording.id, duration: actualDuration };
        } catch (error) {
          console.error(`[LoadDurations] Failed to get duration for ${recording.id}:`, error);
          return { id: recording.id, duration: 60 };
        }
      }
      return null;
    });
    
    // Wait for all duration loads to complete
    const results = await Promise.all(durationPromises);
    const loadedCount = results.filter(r => r !== null).length;
    console.log(`[LoadDurations] Loaded ${loadedCount} actual durations`);
    setLoadingDurations(false);
  };

  // Cleanup effect for component unmounting
  useEffect(() => {
    return () => {
      console.log('[Cleanup] Component unmounting, cleaning up all audio elements');
      Object.keys(audioElements).forEach(recordingId => {
        cleanupAudio(recordingId);
      });
      
      // Also clean up any remaining timers
      Object.keys(smoothUpdateTimers.current).forEach(id => {
        clearInterval(smoothUpdateTimers.current[id]);
        console.log(`[Cleanup] Cleared timer for ${id}`);
      });
      smoothUpdateTimers.current = {};
    };
  }, [audioElements]);

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
        setLoading(false); // Stop loading
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
        const fetchedRecordings: Recording[] = data.recordings;
        setRecordings(fetchedRecordings);
        
        // First try to fetch accurate durations from the database
        try {
          console.log(`[FetchRecordings] 🔍 Fetching durations from database for ${fetchedRecordings.length} recordings...`);
          const durationResponse = await fetch('/api/user/recordings-durations');
          const durationData = await durationResponse.json();
          
          if (durationData.success) {
            console.log(`[FetchRecordings] ✅ Successfully loaded durations from database:`, durationData.durations);
            console.log(`[FetchRecordings] 📊 Duration data breakdown:`);
            
            // Initialize audio states with accurate durations from the database
            const newAudioStates: Record<string, AudioState> = {};
            fetchedRecordings.forEach((recording: Recording) => {
              // Use database duration first, then metadata, then default
              const dbDuration = durationData.durations[recording.id];
              const duration = (dbDuration && dbDuration > 0) ? dbDuration : 
                (recording.metadata.duration > 0 ? recording.metadata.duration : 0);
              
              console.log(`[FetchRecordings] 🎵 Recording ${recording.id}:`);
              console.log(`[FetchRecordings]    📊 DB duration: ${dbDuration || 'N/A'}s`);
              console.log(`[FetchRecordings]    📄 Metadata duration: ${recording.metadata.duration}s`);
              console.log(`[FetchRecordings]    ✅ Using: ${duration}s (${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')})`);
              
              newAudioStates[recording.id] = {
                isPlaying: false,
                currentTime: 0,
                duration: duration,
                isLoading: false
              };
            });
            
            setAudioStates(newAudioStates);
            console.log(`[FetchRecordings] 🎯 Initialized audio states with DB durations - sliders should now show correct times!`);
          } else {
            throw new Error('Failed to load durations from database');
          }
        } catch (durationError) {
          console.error('[FetchRecordings] ❌ Error loading durations from database:', durationError);
          
          // Fallback to initializing with metadata durations
          console.log('[FetchRecordings] 🔄 Falling back to metadata durations...');
          const newAudioStates: Record<string, AudioState> = {};
          fetchedRecordings.forEach((recording: Recording) => {
            const fallbackDuration = recording.metadata.duration || 0;
            console.log(`[FetchRecordings] 📄 Recording ${recording.id}: Using metadata duration ${fallbackDuration}s`);
            
            newAudioStates[recording.id] = {
              isPlaying: false,
              currentTime: 0,
              duration: fallbackDuration,
              isLoading: false
            };
          });
          
          setAudioStates(newAudioStates);
          console.log(`[FetchRecordings] ⚠️  Initialized with metadata durations (may need actual duration loading):`);
          
          // Trigger duration loading as a fallback
          loadActualDurations(fetchedRecordings, newAudioStates);
        }
        
        console.log(`Loaded ${fetchedRecordings.length} recordings from ${data.storage || 'database'}`);

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
    const existingState = audioStates[recordingId];
    
    if (!existingState) {
      // No existing state, create a new one with metadata duration
      const recording = recordings.find(r => r.id === recordingId);
      const initialDuration = recording?.metadata.duration || 0;
      console.log(`[InitializeState] Setting initial duration for ${recordingId}: ${initialDuration}s`);
      
      setAudioStates(prev => ({
        ...prev,
        [recordingId]: {
          isPlaying: false,
          currentTime: 0,
          duration: initialDuration,
          isLoading: false
        }
      }));
    } else {
      // Existing state found, reset play state but preserve duration if it's valid
      console.log(`[InitializeState] Updating existing state for ${recordingId}, preserving duration: ${existingState.duration}s`);
      
      // Only update isPlaying and isLoading, keep duration and currentTime
      updateAudioState(recordingId, {
        isPlaying: false,
        isLoading: false
      });
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
    console.log(`[CleanupAudio] Cleaning up audio for recording: ${recordingId}`);
    
    const audio = audioElements[recordingId];
    if (audio) {
      // Remove all event listeners by cloning the element
      const newAudio = audio.cloneNode() as HTMLAudioElement;
      
      // Stop and cleanup the original
      audio.pause();
      audio.currentTime = 0;
      
      // Revoke the blob URL to free memory
      if (audio.src && audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
      }
      audio.src = '';
      audio.load(); // This helps with cleanup
    }
    
    // Remove from elements state
    setAudioElements(prev => {
      const newElements = { ...prev };
      delete newElements[recordingId];
      return newElements;
    });
    
    // Reset audio state but keep duration info
    const currentState = audioStates[recordingId];
    updateAudioState(recordingId, {
      isPlaying: false,
      currentTime: 0,
      isLoading: false,
      duration: currentState?.duration || 0 // Preserve duration
    });
    
    // Clear playing state if this was the playing recording
    if (playingId === recordingId) {
      setPlayingId(null);
    }
    
    // Clear any smooth update timers for this recording
    if (smoothUpdateTimers.current[recordingId]) {
      clearInterval(smoothUpdateTimers.current[recordingId]);
      delete smoothUpdateTimers.current[recordingId];
      console.log(`[CleanupAudio] Cleared smooth update timer for ${recordingId}`);
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
          setPlayingId(null);
        } else {
          console.log(`[HandlePlay] Resuming existing audio`);
          try {
            await existingAudio.play();
            setPlayingId(recordingId);
          } catch (playError) {
            console.error(`[HandlePlay] Resume error:`, playError);
            // Clean up and try to reload
            cleanupAudio(recordingId);
            updateAudioState(recordingId, { isLoading: false });
            return;
          }
        }
        return;
      }

      // Stop any other playing audio - need to do this BEFORE creating a new audio element
      if (playingId && playingId !== recordingId) {
        try {
          const currentAudio = audioElements[playingId];
          const previousPlayingId = playingId; // Store the ID before clearing it
          
          // First remove the playing ID to prevent any race conditions
          setPlayingId(null);
          
          if (currentAudio) {
            console.log(`[HandlePlay] Stopping previously playing audio (${previousPlayingId}) before playing new one`);
            
            // Update state first
            updateAudioState(previousPlayingId, { isPlaying: false });
            
            // Pause the current audio
            currentAudio.pause();
            
            // Wait a moment to ensure the pause operation is complete
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log(`[HandlePlay] Successfully stopped previous audio, proceeding to play new recording`);
          }
        } catch (stopError) {
          console.warn(`[HandlePlay] Error while stopping previous audio:`, stopError);
          // Continue anyway - we'll try to play the new audio
        }
      }

      // Start loading
      updateAudioState(recordingId, { isLoading: true });

      // Fetch audio data
      let response = await fetch(`/api/user/recordings-mongodb/${recordingId}`);
      if (!response.ok) {
        console.log(`[HandlePlay] MongoDB failed, trying Firebase fallback...`);
        response = await fetch(`/api/user/recordings/${recordingId}`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recording: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      if (audioBlob.size === 0) {
        throw new Error('Recording is empty');
      }
      
      console.log(`[HandlePlay] Fetched audio blob: ${audioBlob.size} bytes`);
      
      // Create and setup audio
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Get fallback duration from recording metadata or use default
      const recording = recordings.find(r => r.id === recordingId);
      // If metadata duration is exactly 60 (likely a default value), use 0 to force actual detection
      const metadataDuration = recording?.metadata?.duration || 0;
      const fallbackDuration = (metadataDuration > 0 && metadataDuration !== 60) ? metadataDuration : 0;
      
      // Setup event listeners - Try multiple events to ensure we get the duration as early as possible
      const updateDurationFromElement = () => {
        const actualDuration = audio.duration;
        // Only use actual duration if it's valid and greater than 0.1 seconds
        if (isFinite(actualDuration) && actualDuration > 0.1) {
          console.log(`[HandlePlay] Got duration: ${actualDuration}s from audio element`);
          updateAudioState(recordingId, { 
            duration: actualDuration,
            isLoading: false
          });
          return true;
        }
        return false;
      };
      
      // Try to get duration immediately if already available
      if (audio.readyState >= 1) {
        updateDurationFromElement();
      }
      
      // Set up multiple event listeners to try to get duration as early as possible
      audio.addEventListener('loadedmetadata', () => {
        const success = updateDurationFromElement();
        if (!success && fallbackDuration > 0) {
          console.log(`[HandlePlay] Loaded metadata but no valid duration, using fallback: ${fallbackDuration}s`);
          updateAudioState(recordingId, { 
            duration: fallbackDuration, 
            isLoading: false 
          });
        }
      });
      
      audio.addEventListener('canplay', () => {
        console.log(`[HandlePlay] Audio can play`);
        updateAudioState(recordingId, { isLoading: false });
      });
      
      // Use a more frequent update for smoother slider movement
      let lastUpdateTime = 0;
      const updateInterval = 50; // Update every 50ms for smoother animation
      
      const timeUpdateHandler = () => {
        const now = Date.now();
        if (isFinite(audio.currentTime) && (now - lastUpdateTime > updateInterval)) {
          lastUpdateTime = now;
          
          // Update both current time and ensure duration is set properly
          updateAudioState(recordingId, { 
            currentTime: audio.currentTime,
            // If we have a valid duration from the audio element, use it
            ...(isFinite(audio.duration) && audio.duration > 0.1 ? { duration: audio.duration } : {})
          });
        }
      };
      
      audio.addEventListener('timeupdate', timeUpdateHandler);
      
      // Also set up a timer for even smoother updates than native timeupdate events
      const smoothUpdateTimer = setInterval(() => {
        if (audio && !audio.paused && isFinite(audio.currentTime)) {
          timeUpdateHandler();
        }
      }, updateInterval);
      
      // Store the interval ID for cleanup
      smoothUpdateTimers.current[recordingId] = smoothUpdateTimer;
      
      audio.addEventListener('ended', () => {
        console.log(`[HandlePlay] Audio ended`);
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
        const errorDetails = {
          type: e.type,
          message: (e as any).message || 'Unknown audio error',
          code: (audio.error?.code) || 'unknown',
          networkState: audio.networkState,
          readyState: audio.readyState
        };
        console.error('[HandlePlay] Audio error details:', errorDetails);
        
        updateAudioState(recordingId, { 
          isPlaying: false, 
          isLoading: false 
        });
        setPlayingId(null);
        
        // Clean up the URL object
        URL.revokeObjectURL(audioUrl);
        
        // Remove from elements but keep state for retry
        setAudioElements(prev => {
          const newElements = { ...prev };
          delete newElements[recordingId];
          return newElements;
        });
      });

      audio.addEventListener('loadstart', () => {
        console.log(`[HandlePlay] Load started`);
      });

      // Store element first, then try to play
      setAudioElements(prev => ({ ...prev, [recordingId]: audio }));
      
      // Get current state
      const currentState = audioStates[recordingId];
      const currentDuration = currentState?.duration || 0;
      
      // Set initial duration from metadata if available and different from default 60 seconds
      if (fallbackDuration > 0 && (currentDuration === 0 || currentDuration === 60)) {
        updateAudioState(recordingId, { duration: fallbackDuration });
      }
      
      // Set the audio position to the current seek position if user has seeked
      if (currentState && currentState.currentTime > 0) {
        console.log(`[HandlePlay] Setting audio position to seeked time: ${currentState.currentTime}s`);
        audio.currentTime = currentState.currentTime;
      }
      
      try {
        // Make sure no other audio is playing first (double-check)
        const allAudioElements = Object.entries(audioElements);
        for (const [id, element] of allAudioElements) {
          if (id !== recordingId && !element.paused) {
            console.log(`[HandlePlay] Found another playing audio (${id}), pausing it first`);
            element.pause();
            updateAudioState(id, { isPlaying: false });
            // Small delay to ensure pause completes
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        // Now it's safe to play our audio
        console.log(`[HandlePlay] Playing audio for ${recordingId}`);
        const playPromise = audio.play();
        
        // Handle play promise properly
        await playPromise.catch(error => {
          // If the error is about interruption, try again after a short delay
          if (error.name === 'AbortError' || 
              (error.message && error.message.includes('interrupted'))) {
            console.log('[HandlePlay] Play was interrupted, trying again after delay');
            return new Promise(resolve => {
              setTimeout(async () => {
                try {
                  await audio.play();
                  resolve(undefined);
                } catch (retryError) {
                  console.error('[HandlePlay] Retry failed:', retryError);
                  throw retryError;
                }
              }, 200);
            });
          }
          throw error;
        });
        
        console.log(`[HandlePlay] Successfully started playback for ${recordingId}`);
      } catch (playError) {
        console.error(`[HandlePlay] Play error:`, playError);
        updateAudioState(recordingId, { isPlaying: false, isLoading: false });
        // Don't throw, just handle gracefully
        const error = playError as Error;
        if (error.name !== 'AbortError') {
          alert(`Playback issue: ${error.message || 'Unknown error'}`);
        }
      }
      
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
    const recording = recordings.find(r => r.id === recordingId);
    const duration = state?.duration || recording?.metadata.duration || 0;
    
    console.log(`[HandleSeek] Seeking to ${newTime}s for recording: ${recordingId} (duration: ${duration}s, hasAudio: ${!!audio})`);
    
    if (duration > 0 && isFinite(newTime) && newTime >= 0 && newTime <= duration) {
      // Update the UI state immediately for responsiveness
      updateAudioState(recordingId, { currentTime: newTime });
      
      // If we have an audio element, seek it
      if (audio) {
        try {
          audio.currentTime = newTime;
        } catch (error) {
          console.error('[HandleSeek] Seek error:', error);
        }
      } else {
        // If no audio element exists yet, we'll just update the state
        // The audio will start from this position when play is clicked
        console.log(`[HandleSeek] No audio element yet, just updating state to ${newTime}s`);
      }
    } else {
      console.log(`[HandleSeek] Seek blocked - duration: ${duration}, newTime: ${newTime}`);
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
    // Check for invalid values
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
    
    // Round to nearest tenth of a second to avoid floating point issues
    seconds = Math.round(seconds * 10) / 10;
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      
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
            {/* Loading durations indicator */}
            {loadingDurations && (
              <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm text-blue-700">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading actual recording durations...</span>
                </div>
              </div>
            )}
            
            {/* Manual refresh button for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-3 bg-yellow-50 border-b border-yellow-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadActualDurations(recordings, audioStates)}
                  disabled={loadingDurations}
                  className="text-yellow-700"
                >
                  {loadingDurations ? 'Loading...' : '🔄 Refresh Durations'}
                </Button>
                <span className="ml-2 text-xs text-yellow-600">
                  Click to manually load actual recording durations
                </span>
              </div>
            )}
            
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-2 bg-gray-100 text-xs">
                <strong>Debug:</strong> Playing: {playingId || 'none'} | States: {Object.keys(audioStates).length} | Elements: {Object.keys(audioElements).length} | LoadingDurations: {loadingDurations}
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
                              'none'} | HasElement: {!!audioElements[recording.id]} | MetadataDuration: {recording.metadata.duration}s
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

                      {/* Progress Bar - Always show, get duration dynamically if needed */}
                      <div className="space-y-1">
                        {process.env.NODE_ENV === 'development' && (
                          <div className="text-xs text-purple-600">
                            Slider Debug: duration={recording.metadata.duration}, audioState={!!audioStates[recording.id]}, shouldShow={true}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className="w-8 text-right">{formatTime(audioStates[recording.id]?.currentTime || 0)}</span>
                          <div className="flex-1 relative h-4 flex items-center">
                            {(() => {
                              // Get duration from audio state or use a default minimum
                              const currentTime = audioStates[recording.id]?.currentTime || 0;
                              
                              // Get the most reliable duration source in order of priority:
                              // 1. From the audio state which should be loaded from the database now
                              // 2. From the audio element if it's loaded and has a valid duration
                              // 3. From metadata if it's not the default value (60s)
                              let duration = 0;
                              
                              // First check audio state which should now be initialized with DB values
                              if (audioStates[recording.id]?.duration > 0) {
                                duration = audioStates[recording.id].duration;
                              } 
                              // If that's not available, check audio element
                              else {
                                const audioElement = audioElements[recording.id];
                                if (audioElement && isFinite(audioElement.duration) && audioElement.duration > 0.1) {
                                  duration = audioElement.duration;
                                } 
                                // Last resort check metadata
                                else if (recording.metadata.duration > 0 && recording.metadata.duration !== 60) {
                                  duration = recording.metadata.duration;
                                } 
                                // If we have no valid duration, use a small placeholder but ensure slider works
                                else {
                                  duration = Math.max(currentTime + 1, 1); // At least 1 second or longer than current time
                                }
                              }
                              const isDisabled = false; // Never disable, always allow seeking
                              
                              console.log(`[Slider] Rendering for ${recording.id}: currentTime=${currentTime}, duration=${duration}, state=${audioStates[recording.id]?.duration}, metadata=${recording.metadata.duration}`);
                              
                              return (
                                <Slider
                                  value={[currentTime]}
                                  max={duration || 1} // Ensure max is never 0 which would make slider non-functional
                                  step={0.1}
                                  onValueChange={(value) => {
                                    const newTime = value[0];
                                    console.log(`[Slider] User seeking to: ${newTime}s`);
                                    handleSeek(recording.id, newTime);
                                  }}
                                  disabled={isDisabled}
                                  className="w-full"
                                />
                              );
                            })()}
                          </div>
                          <span className="w-8 text-left">
                            {(() => {
                              // Use same duration logic as the slider to ensure consistency
                              let displayDuration = 0;
                              
                              // First check audio state which should now be initialized with DB values
                              if (audioStates[recording.id]?.duration > 0) {
                                displayDuration = audioStates[recording.id].duration;
                              } 
                              // If that's not available, check audio element
                              else {
                                const audioElement = audioElements[recording.id];
                                if (audioElement && isFinite(audioElement.duration) && audioElement.duration > 0.1) {
                                  displayDuration = audioElement.duration;
                                } 
                                // Last resort check metadata
                                else if (recording.metadata.duration > 0 && recording.metadata.duration !== 60) {
                                  displayDuration = recording.metadata.duration;
                                }
                              }
                              
                              return formatTime(displayDuration);
                            })()}
                          </span>
                        </div>
                      </div>
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
