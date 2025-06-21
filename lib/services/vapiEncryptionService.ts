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
          
          // Store encrypted recording via API
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append('interviewId', interviewId);
          formData.append('metadata', JSON.stringify(metadata));
          
          const response = await fetch('/api/user/recordings', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            console.log("Interview recording encrypted and stored successfully");
          } else {
            console.error("Failed to store recording:", await response.text());
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
      // Get and decrypt the recording via API
      const response = await fetch(`/api/user/recordings/${recordingId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recording: ${response.statusText}`);
      }
      
      const recordingData = await response.json();
      
      // Convert array back to buffer
      const buffer = new Uint8Array(recordingData.audioData);
      
      // Convert buffer to blob
      const blob = new Blob([buffer], { type: 'audio/webm' });
      
      // Create object URL for audio playback
      const audioUrl = URL.createObjectURL(blob);
      
      // Create audio element
      const audioElement = new Audio(audioUrl);
      
      // Start playback
      audioElement.play();
      
      // Return cleanup function
      return () => {
        audioElement.pause();
        audioElement.src = '';
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Error playing encrypted recording:", error);
      return () => {}; // Return empty cleanup function
    }
  }
};

export default vapiEncryptionService;
