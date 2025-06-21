// Example: Update a component to use MongoDB

// OLD (Firebase):
import voiceDataService from "@/lib/services/voiceDataService";

// NEW (MongoDB):
import voiceDataServiceMongoDB from "@/lib/services/voiceDataServiceMongoDB";

// Usage remains the same:
const recordingId = await voiceDataServiceMongoDB.storeVoiceRecording(
  userId, 
  interviewId, 
  audioBuffer, 
  metadata
);
