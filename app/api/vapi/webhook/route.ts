import { NextResponse } from 'next/server';
import { voiceDataServiceMongoDB } from '@/lib/services/voiceDataServiceMongoDB';

/**
 * This endpoint handles incoming webhooks from Vapi.
 * Specifically, it processes the 'end-of-call-report' to save the recording details.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    // Ensure the message object exists
    if (!message) {
      console.error('[Vapi Webhook] Invalid payload: message object is missing.', { body });
      return NextResponse.json({ error: 'Invalid payload: message object is missing.' }, { status: 400 });
    }

    // Check if it's the end of call report
    if (message.type === 'end-of-call-report') {
      console.log('[Vapi Webhook] Received End of Call Report:', JSON.stringify(message, null, 2));

      const { call, recordingUrl } = message;

      // Ensure the call object exists before proceeding
      if (!call) {
        console.error('[Vapi Webhook] Invalid payload: call object is missing from end-of-call-report.', { message });
        return NextResponse.json({ error: 'Invalid payload: call object is missing.' }, { status: 400 });
      }

      // Log the entire call object to debug the structure
      console.log('[Vapi Webhook] Full call object received:', JSON.stringify(call, null, 2));

      // Safely access variables from the correct path in the payload
      const variables = call.assistantOverrides?.variableValues;

      if (!variables || !variables.userId || !variables.interviewId) {
        console.error('[Vapi Webhook] Missing userId or interviewId in call.assistantOverrides.variableValues. Full message:', JSON.stringify(message, null, 2));
        return NextResponse.json({ error: 'Missing required variables from Vapi webhook to save recording.' }, { status: 400 });
      }

      const { userId, interviewId, interviewRole, interviewType } = variables;

      // Ensure a recording URL is present
      if (!recordingUrl) {
        console.error(`[Vapi Webhook] No recordingUrl provided for interview: ${interviewId}.`);
        // We can still mark the interview as complete, but log that there's no recording.
        return NextResponse.json({ error: 'No recording URL in Vapi report.' }, { status: 400 });
      }

      // FINAL FIX: Read duration directly from the correct location in the message payload.
      const callDurationMs = message.durationMs;
      let finalDuration = 0;

      if (typeof callDurationMs === 'number' && !isNaN(callDurationMs)) {
        finalDuration = Math.round(callDurationMs / 1000);
        console.log(`[Vapi Webhook] Correctly read duration from message.durationMs: ${finalDuration}s`);
      } else {
        console.warn(`[Vapi Webhook] Could not find duration in message.durationMs for interview: ${interviewId}. Defaulting to 0.`);
      }
      
      console.log(`[Vapi Webhook] Storing final duration: ${finalDuration}s for interview: ${interviewId}`);

      // Store the recording info using our existing service
      await voiceDataServiceMongoDB.storeVoiceRecordingFromUrl({
        userId,
        interviewId,
        recordingUrl,
        duration: finalDuration,
        interviewRole,
        interviewType,
      });

      console.log(`[Vapi Webhook] Successfully saved recording for interview: ${interviewId}`);
    }

    // Respond to Vapi to acknowledge receipt of the webhook
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Vapi Webhook] Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
