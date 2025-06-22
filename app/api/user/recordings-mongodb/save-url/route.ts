import { NextResponse } from 'next/server';
import { voiceDataServiceMongoDB } from '@/lib/services/voiceDataServiceMongoDB';
import { getCurrentUser } from '@/lib/actions/auth.actions';

export async function POST(req: Request) {
  try {
    const { interviewId, recordingUrl, duration } = await req.json();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!interviewId || !recordingUrl || typeof duration !== 'number') {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const recordingId = await voiceDataServiceMongoDB.storeVoiceRecordingFromUrl({
      userId: user.id,
      interviewId,
      recordingUrl,
      duration,
    });

    return NextResponse.json({ success: true, recordingId });

  } catch (error) {
    console.error('[API] Error saving recording URL:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to save recording URL', error: errorMessage }, { status: 500 });
  }
}
