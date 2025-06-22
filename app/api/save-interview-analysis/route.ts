import { NextRequest, NextResponse } from 'next/server';
import models from '@/lib/models/mongodb-schemas';
import { connectToMongoDB } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
        await connectToMongoDB();

    const { interviewId } = await req.json();

    if (!interviewId) {
      return new NextResponse(JSON.stringify({ error: 'Interview ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

        const updatedRecording = await models.VoiceRecording.findOneAndUpdate(
      { interviewId: interviewId },
      { $set: { isSaved: true } },
      { new: true } 
    );

    if (!updatedRecording) {
      return new NextResponse(JSON.stringify({ error: 'Interview not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

        return new NextResponse(JSON.stringify({ message: 'Interview saved successfully', interview: updatedRecording }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[API Save Analysis] Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to save interview' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
