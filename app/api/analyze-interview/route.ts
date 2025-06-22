import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { VoiceRecording } from '@/lib/models/mongodb-schemas';

// This is a placeholder for your actual Python backend URL
const PYTHON_ANALYSIS_BACKEND_URL = process.env.PYTHON_ANALYSIS_BACKEND_URL || 'http://127.0.0.1:8000/analyze-audio/';

export async function POST(request: Request) {
  try {
    const { interviewId, recordingUrl } = await request.json();

    if (!interviewId || !recordingUrl) {
      return NextResponse.json({ error: 'Interview ID and Recording URL are required' }, { status: 400 });
    }

    // --- Call the Python Backend for Analysis ---
    console.log(`[API Analyze] Sending request to Python backend for interview: ${interviewId}`);
    const analysisResponse = await fetch(PYTHON_ANALYSIS_BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_url: recordingUrl }), // Ensure your Python backend expects this format
    });

    if (!analysisResponse.ok) {
      const errorBody = await analysisResponse.text();
      console.error('[API Analyze] Python backend failed:', errorBody);
      return NextResponse.json({ error: 'Analysis service failed.', details: errorBody }, { status: 502 }); // 502 Bad Gateway
    }

    const analysisReport = await analysisResponse.json();
    console.log(`[API Analyze] Received report from Python backend.`);

    // --- Save the Report to MongoDB ---
    await connectToMongoDB();
    const updatedInterview = await VoiceRecording.findOneAndUpdate(
      { interviewId },
      {
        $set: {
          analysisReport: analysisReport, // Save the entire report object
          processingStatus: 'completed',
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedInterview) {
      return NextResponse.json({ error: 'Interview not found to save the report' }, { status: 404 });
    }

    console.log(`[API Analyze] Successfully saved analysis report for interview: ${interviewId}`);

    return NextResponse.json({ success: true, analysisReport });

  } catch (error) {
    console.error('[API Analyze] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
