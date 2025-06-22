import { NextResponse } from 'next/server';
// HACKATHON-FIX: Temporarily removed Clerk auth to fix auth mismatch.
// import { auth } from '@clerk/nextjs/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { VoiceRecording } from '@/lib/models/mongodb-schemas';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get('interviewId');

    if (!interviewId) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
    }

    await connectToMongoDB();

    // HACKATHON-FIX: Querying by interviewId only.
    const interviewData = await VoiceRecording.findOne({ interviewId });

    if (!interviewData) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json(interviewData);
  } catch (error) {
    console.error('[API Get-Interview-Details] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
