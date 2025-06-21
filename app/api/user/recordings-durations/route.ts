import { NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/actions/auth.actions";
import voiceDataServiceMongoDB from "@/lib/services/voiceDataServiceMongoDB";

export async function GET(request: Request) {
  console.log('[recordings-durations] API endpoint called - fetching durations from MongoDB');
  
  try {
    // Use the same authentication pattern as the working recordings route
    console.log('[recordings-durations] Verifying user authentication...');
    const user = await getCurrentUser();
    
    if (!user) {
      console.log('[recordings-durations] No authenticated user found');
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    console.log(`[recordings-durations] Auth successful for user: ${user.id}`);
    
    // Use the same service pattern as the working recordings route
    console.log('[recordings-durations] Fetching recordings from MongoDB via voiceDataService...');
    const recordings = await voiceDataServiceMongoDB.getUserRecordings(user.id, 100);
    
    console.log(`[recordings-durations] Found ${recordings.length} recordings in database for user ${user.id}`);
    
    // Create a map of recordingId -> duration
    console.log('[recordings-durations] ========== DURATION DETAILS ==========');
    const durationMap = recordings.reduce((map: Record<string, number>, recording: any) => {
      // Use the string ID as the key
      const recordingId = recording._id.toString();
      
      // Duration is stored in metadata.duration according to schema
      const duration = recording.metadata?.duration || recording.duration || 0;
      
      // Log each recording's duration for debugging
      console.log(`[recordings-durations] 📊 Recording ID: ${recordingId}`);
      console.log(`[recordings-durations]    ⏱️  Duration: ${duration} seconds (${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')})`);
      console.log(`[recordings-durations]    📄 Raw duration value: ${recording.duration}`);
      console.log(`[recordings-durations]    📄 Metadata duration value: ${recording.metadata?.duration}`);
      console.log(`[recordings-durations]    📄 Full recording object:`, JSON.stringify(recording, null, 2));
      console.log(`[recordings-durations]    📄 Metadata object:`, JSON.stringify(recording.metadata, null, 2));
      console.log(`[recordings-durations]    ✅ Will be used in slider: ${duration > 0 ? 'YES' : 'NO (fallback needed)'}`);
      console.log('[recordings-durations]    -------------------------');
      
      map[recordingId] = duration;
      return map;
    }, {} as Record<string, number>);
    
    console.log('[recordings-durations] ========================================');
    
    // Log the complete duration map
    console.log(`[recordings-durations] 🎯 FINAL DURATION MAP (${Object.keys(durationMap).length} recordings):`);
    Object.entries(durationMap).forEach(([id, duration]) => {
      console.log(`[recordings-durations]    ${id}: ${duration}s`);
    });
    console.log('[recordings-durations] ========================================');
    
    // No need to close connection manually when using voiceDataServiceMongoDB
    console.log('[recordings-durations] 🚀 Sending duration data to frontend...');
    return NextResponse.json({ 
      success: true,
      durations: durationMap
    });
    
  } catch (error) {
    console.error('[recordings-durations] ❌ ERROR fetching recording durations:', error);
    console.error('[recordings-durations] Error stack:', (error as Error).stack);
    return NextResponse.json({ 
      success: false, 
      message: (error as Error).message || 'Failed to fetch recording durations' 
    }, { status: 500 });
  }
}
