import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Log the Vapi interaction data to the server console
    console.log('----------------------------------------');
    console.log('VAPI INTERACTION DEBUG LOG:');
    console.log('----------------------------------------');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Interaction Type:', data.type);
    console.log('Details:', JSON.stringify(data.details, null, 2));
    console.log('----------------------------------------');
    
    // Store in environment-specific logging system if needed
    // For production, you might want to use a logging service
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Vapi debug log:', error);
    return NextResponse.json(
      { error: 'Failed to process debug log' },
      { status: 500 }
    );
  }
}
