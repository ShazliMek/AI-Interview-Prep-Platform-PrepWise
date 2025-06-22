import { NextRequest, NextResponse } from 'next/server';
import { voiceDataServiceMongoDB } from '@/lib/services/voiceDataServiceMongoDB';


/**
 * API endpoint to mark an interview as completed and save its final duration.
 * This is called from the frontend when the call ends.
 */
export async function POST(request: NextRequest) {
  try {


    const body = await request.json();
    // HACKATHON FIX: Read userId from body instead of session
    const { interviewId, duration, role, type, company, level, userId } = body;

    if (!userId || !interviewId || typeof duration === 'undefined' || !role || !type || !level) {
      return NextResponse.json({ error: 'Missing required interview metadata, including userId' }, { status: 400 });
    }

    console.log(`[API Save-Interview] Received request to save metadata for interview ${interviewId}`);

    const success = await voiceDataServiceMongoDB.saveInterviewMetadata({
      interviewId,
      userId,
      duration,
      role,
      type,
      company: company || 'Not specified',
      level,
    });

    if (success) {
      console.log(`[API Save-Interview] Successfully saved metadata for interview: ${interviewId}`);
      return NextResponse.json({ success: true, message: 'Interview metadata saved successfully.' });
    } else {
      console.error(`[API Save-Interview] Failed to save metadata for interview: ${interviewId}`);
      return NextResponse.json({ success: false, message: 'Failed to save interview metadata.' }, { status: 500 });
    }
  } catch (error) {
    console.error('[API Save-Interview] Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to save interview completion data', error: errorMessage }, { status: 500 });
  }
}


