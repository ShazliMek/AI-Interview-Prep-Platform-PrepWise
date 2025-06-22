import { NextResponse } from 'next/server';
import { voiceDataServiceMongoDB } from '@/lib/services/voiceDataServiceMongoDB';

// Define the structure of the analysis report we expect from the backend
interface AnalysisReport {
  transcript: string;
  duration_seconds: number;
  // Add other fields from your Python analysis script as needed
}

/**
 * This endpoint handles incoming webhooks from Vapi.
 * It saves recording details and triggers the backend analysis.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      console.error('[Vapi Webhook] Invalid payload: message object is missing.', { body });
      return NextResponse.json({ error: 'Invalid payload: message object is missing.' }, { status: 400 });
    }

    if (message.type === 'end-of-call-report') {
      console.log('[Vapi Webhook] Received End of Call Report.');

      const { call, recordingUrl } = message;

      if (!call) {
        console.error('[Vapi Webhook] Invalid payload: call object is missing.', { message });
        return NextResponse.json({ error: 'Invalid payload: call object is missing.' }, { status: 400 });
      }

      const variables = call.assistantOverrides?.variableValues;
      if (!variables || !variables.userId || !variables.interviewId) {
        console.error('[Vapi Webhook] Missing required variables.', { variables });
        return NextResponse.json({ error: 'Missing required variables to process report.' }, { status: 400 });
      }

      if (!recordingUrl) {
        console.error(`[Vapi Webhook] No recordingUrl for interview: ${variables.interviewId}.`);
        return NextResponse.json({ error: 'No recording URL in Vapi report.' }, { status: 400 });
      }

      const { userId, interviewId, interviewRole, interviewType } = variables;
      const finalDuration = message.durationMs ? Math.round(message.durationMs / 1000) : 0;

      // --- Trigger Backend Analysis ---
      const analysisUrl = process.env.PYTHON_ANALYSIS_BACKEND_URL || 'http://127.0.0.1:8000/analyze-audio/';
      let analysisReport: AnalysisReport | null = null;

      try {
        console.log(`[Vapi Webhook] Triggering analysis for ${interviewId} at ${analysisUrl}`);
        const analysisResponse = await fetch(analysisUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio_url: recordingUrl }),
        });

        if (!analysisResponse.ok) {
          const errorBody = await analysisResponse.text();
          throw new Error(`Analysis request failed with status ${analysisResponse.status}: ${errorBody}`);
        }

        analysisReport = await analysisResponse.json();
        console.log(`[Vapi Webhook] Analysis successful for interview: ${interviewId}`);

      } catch (error) {
        console.error(`[Vapi Webhook] Error during analysis request for ${interviewId}:`, error);
        // Continue to save the recording metadata even if analysis fails
      }

      // --- Save to Database ---
      await voiceDataServiceMongoDB.storeVoiceRecordingFromUrl({
        userId,
        interviewId,
        recordingUrl,
        duration: finalDuration,
        interviewRole,
        interviewType,
        analysis: analysisReport, // Save the report (or null if it failed)
      });

      console.log(`[Vapi Webhook] Successfully processed and stored data for interview: ${interviewId}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Vapi Webhook] Unhandled error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
