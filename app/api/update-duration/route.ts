import { NextResponse } from 'next/server';
import { voiceDataServiceMongoDB } from '@/lib/services/voiceDataServiceMongoDB';

export async function POST(request: Request) {
  try {
    const { interviewId, duration } = await request.json();

    if (!interviewId || typeof duration !== 'number') {
      return NextResponse.json({ message: 'Missing interviewId or duration' }, { status: 400 });
    }

    const success = await voiceDataServiceMongoDB.updateRecordingDuration(interviewId, duration);

    if (success) {
      return NextResponse.json({ message: 'Duration updated successfully' });
    } else {
      return NextResponse.json({ message: 'Failed to update duration' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating duration:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
