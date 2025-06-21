import { NextRequest, NextResponse } from 'next/server';

// CORS headers for allowing Vapi to access this endpoint
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

/**
 * API endpoint for saving interview data
 * Called by the Vapi workflow to save interview session data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interviewData, feedback, timestamp } = body;
    
    // Log the incoming data
    console.log('Save interview data request:', { interviewData, feedback, timestamp });
    
    // In a production environment, you would:
    // 1. Validate the data
    // 2. Save to database (MongoDB, Firebase, etc.)
    // 3. Process any analytics or follow-up actions
    
    // For now, we'll just acknowledge receipt
    
    // TODO: Implement actual database storage
    // Example with MongoDB schema:
    /*
    const interview = new InterviewSession({
      company: interviewData.company,
      jobTitle: interviewData.jobTitle,
      experience: interviewData.experience,
      techStack: interviewData.techStack,
      notes: interviewData.notes,
      questionsAsked: interviewData.questionsAsked,
      feedback,
      timestamp: timestamp || new Date().toISOString(),
      userId: interviewData.userId || 'anonymous'
    });
    
    await interview.save();
    */
    
    return NextResponse.json({ 
      success: true, 
      message: 'Interview data received successfully',
      savedAt: new Date().toISOString()
    }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error saving interview data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save interview data' 
      }, 
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
