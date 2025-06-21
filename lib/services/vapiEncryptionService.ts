import { vapi } from '@/lib/vapi.sdk';
// Note: voiceDataService and getCurrentUser imports moved to avoid client-side server imports

/**
 * Service to integrate Vapi's voice calls with our encryption system
 * Client-side version for browser compatibility
 */
export const vapiEncryptionService = {
  /**
   * Start recording and encrypting a Vapi interview call
   * 
   * @param interviewId The ID of the interview session
   * @returns A cleanup function to stop recording
   */
  async startEncryptedRecording(interviewId: string): Promise<() => void> {
    // This will hold audio chunks
    const audioChunks: Blob[] = [];
    let isRecording = true;
    let recordingStream: MediaStream | null = null;
    let mediaRecorder: MediaRecorder | null = null;
    
    try {
      // Get current user via API call instead of direct import
      const userResponse = await fetch('/api/user/current');
      const userData = await userResponse.json();
      
      if (!userData.success || !userData.user) {
        throw new Error("User not authenticated");
      }

      // Check browser compatibility
      if (!navigator.mediaDevices || !MediaRecorder) {
        console.warn("Recording not supported in this browser");
        return () => {}; // Return empty cleanup function
      }
      
      // Request microphone access
      recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder instance
      mediaRecorder = new MediaRecorder(recordingStream);
      
      // Start recording
      mediaRecorder.start();
      
      // Collect audio chunks
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0 && isRecording) {
          audioChunks.push(event.data);
        }
      });

      // Save recording when stopped
      mediaRecorder.addEventListener('stop', async () => {
        if (!isRecording || audioChunks.length === 0) return;
        
        try {
          // Combine chunks into a single blob
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          // Convert to buffer for encryption
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioBuffer = Buffer.from(arrayBuffer);
          
          // Create metadata
          const metadata = {
            duration: 0, // Would need to calculate actual duration
            fileSize: audioBuffer.byteLength,
            mimeType: 'audio/webm'
          };
          
          // Store encrypted recording via API (try MongoDB first, fallback to Firebase)
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append('interviewId', interviewId);
          formData.append('metadata', JSON.stringify(metadata));
          
          // Try MongoDB endpoint first
          let response = await fetch('/api/user/recordings-mongodb', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) {
            console.log('MongoDB storage failed, trying Firebase fallback...');
            // Fallback to Firebase endpoint
            response = await fetch('/api/user/recordings', {
              method: 'POST',
              body: formData
            });
          }
          
          if (response.ok) {
            const result = await response.json();
            console.log("Interview recording encrypted and stored successfully:", result);
          } else {
            const errorText = await response.text();
            console.error("Failed to store recording:", errorText);
          }
        } catch (error) {
          console.error("Failed to encrypt and store interview recording:", error);
        }
      });
      
      // Listen for Vapi call end to trigger saving
      const handleCallEnd = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      };
      
      vapi.on('call-end', handleCallEnd);
      
      // Return cleanup function
      return () => {
        isRecording = false;
        
        // Clean up Vapi event listener
        vapi.off('call-end', handleCallEnd);
        
        // Stop recording
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        
        // Stop all tracks
        if (recordingStream) {
          recordingStream.getTracks().forEach(track => track.stop());
        }
      };
    } catch (error) {
      console.error("Error starting encrypted recording:", error);
      return () => {}; // Return empty cleanup function
    }
  },
  
  /**
   * Retrieve and play back an encrypted recording
   * 
   * @param recordingId The ID of the encrypted recording
   * @returns A cleanup function to stop playback
   */
  async playEncryptedRecording(recordingId: string): Promise<() => void> {
    try {
      console.log(`[Vapi Encryption Service] Playing recording: ${recordingId}`);
      
      // Check authentication first
      const authResponse = await fetch('/api/user/current');
      const authData = await authResponse.json();
      
      if (!authData.success) {
        throw new Error('Authentication required. Please sign in to play recordings.');
      }
      
      // Try MongoDB endpoint first, fallback to Firebase
      let response = await fetch(`/api/user/recordings-mongodb/${recordingId}`);
      
      if (!response.ok) {
        console.log('MongoDB playback failed, trying Firebase fallback...');
        response = await fetch(`/api/user/recordings/${recordingId}`);
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in to play recordings.');
        } else if (response.status === 404) {
          throw new Error('Recording not found. It may have been deleted or expired.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You can only play your own recordings.');
        } else {
          throw new Error(`Failed to fetch recording: ${response.status} ${response.statusText}`);
        }
      }
      
      // Get the audio data as blob
      const audioBlob = await response.blob();
      console.log(`[Vapi Encryption Service] Retrieved audio blob: ${audioBlob.size} bytes`);
      
      if (audioBlob.size === 0) {
        throw new Error('Recording is empty or corrupted.');
      }
      
      // Create object URL for audio playback
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create audio element
      const audioElement = new Audio(audioUrl);
      
      // Add error handling for audio playback
      audioElement.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        URL.revokeObjectURL(audioUrl);
      });
      
      // Start playback
      await audioElement.play();
      console.log(`[Vapi Encryption Service] Started playback for recording: ${recordingId}`);
      
      // Return cleanup function
      return () => {
        audioElement.pause();
        audioElement.currentTime = 0;
        URL.revokeObjectURL(audioUrl);
        console.log(`[Vapi Encryption Service] Stopped playback for recording: ${recordingId}`);
      };
    } catch (error) {
      console.error("Error playing encrypted recording:", error);
      throw error;
    }
  }
};

export default vapiEncryptionService;
