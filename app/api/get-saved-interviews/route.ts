import { NextRequest, NextResponse } from 'next/server';
import models from '@/lib/models/mongodb-schemas';
import { connectToMongoDB } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/actions/auth.actions';

export async function GET(req: NextRequest) {
  try {
    await connectToMongoDB();
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

        const savedInterviews = await models.VoiceRecording.find({
      'metadata.userId': user.uid,
      isSaved: true,
    }).sort({ createdAt: -1 });

        return new NextResponse(JSON.stringify({ interviews: savedInterviews }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[API Get Saved Interviews] Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch saved interviews' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
