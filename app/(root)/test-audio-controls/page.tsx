'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

export default function AudioTestPage() {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false
  });
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = async () => {
    try {
      if (audioElement) {
        if (audioState.isPlaying) {
          audioElement.pause();
          return;
        } else {
          await audioElement.play();
          return;
        }
      }

      // Create new audio element
      setAudioState(prev => ({ ...prev, isLoading: true }));
      
      const audio = new Audio('/api/test-audio');
      
      audio.addEventListener('loadedmetadata', () => {
        console.log('Metadata loaded, duration:', audio.duration);
        setAudioState(prev => ({
          ...prev,
          duration: isFinite(audio.duration) ? audio.duration : 0,
          isLoading: false
        }));
      });
      
      audio.addEventListener('timeupdate', () => {
        setAudioState(prev => ({
          ...prev,
          currentTime: audio.currentTime
        }));
      });
      
      audio.addEventListener('ended', () => {
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: 0
        }));
        setAudioElement(null);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          isLoading: false
        }));
        setAudioElement(null);
      });

      audio.addEventListener('pause', () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      });

      audio.addEventListener('play', () => {
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      });

      setAudioElement(audio);
      await audio.play();
      
    } catch (error) {
      console.error('Play error:', error);
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false
      }));
      alert(`Play error: ${(error as Error).message}`);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioElement && audioState.duration > 0) {
      audioElement.currentTime = newTime;
      setAudioState(prev => ({ ...prev, currentTime: newTime }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Audio Controls Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-medium mb-4">Test Audio (2s sine wave)</h2>
          
          {/* Debug Info */}
          <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
            <strong>Debug:</strong><br/>
            Playing: {audioState.isPlaying ? 'Yes' : 'No'}<br/>
            Duration: {audioState.duration}s<br/>
            Current: {audioState.currentTime}s<br/>
            Loading: {audioState.isLoading ? 'Yes' : 'No'}<br/>
            Has Element: {audioElement ? 'Yes' : 'No'}
          </div>
          
          {/* Controls */}
          <div className="space-y-3">
            <Button
              onClick={handlePlay}
              disabled={audioState.isLoading}
              className="w-full"
            >
              {audioState.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading</span>
                </div>
              ) : audioState.isPlaying ? (
                '⏸️ Pause'
              ) : (
                '▶️ Play'
              )}
            </Button>
            
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatTime(audioState.currentTime)}</span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max={Math.max(audioState.duration, 1)}
                    value={audioState.currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    disabled={audioState.duration <= 0}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: audioState.duration > 0 ? 
                        `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                          (audioState.currentTime / audioState.duration) * 100
                        }%, #E5E7EB ${
                          (audioState.currentTime / audioState.duration) * 100
                        }%, #E5E7EB 100%)` : 
                        '#E5E7EB'
                    }}
                  />
                </div>
                <span>{formatTime(audioState.duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
