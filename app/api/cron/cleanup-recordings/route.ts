import { NextResponse } from 'next/server';
import voiceDataService from '@/lib/services/voiceDataService';

// This endpoint should be protected and only accessible by authorized services
// like a cron job service or scheduled cloud function
export async function GET(request: Request) {
  try {
    // Check for a secret key to authorize the request
    const { searchParams } = new URL(request.url);
    const authToken = searchParams.get('auth_token');
    const secretKey = process.env.CRON_SECRET_KEY;

    // Validate the auth token
    if (!secretKey || authToken !== secretKey) {
      console.warn('Unauthorized attempt to access cleanup endpoint');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Clean up expired recordings
    const deletedCount = await voiceDataService.cleanupExpiredRecordings();

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned up ${deletedCount} expired recordings.`
    });
  } catch (error) {
    console.error('Error in cleanup job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to run cleanup job' },
      { status: 500 }
    );
  }
}
