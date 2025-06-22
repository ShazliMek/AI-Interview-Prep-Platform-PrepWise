import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { VoiceRecording } from '@/lib/models/mongodb-schemas';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get('interviewId');

    if (!interviewId) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
    }

    await connectToMongoDB();

    const result = await VoiceRecording.deleteOne({ interviewId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    console.log(`[API Delete] Successfully deleted interview: ${interviewId}`);
    return NextResponse.json({ success: true, message: 'Interview deleted successfully.' });

  } catch (error) {
    console.error('[API Delete] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
