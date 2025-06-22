import { NextRequest, NextResponse } from 'next/server';
import { getPresetInterviewById } from '@/constants/presets';

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
 * API endpoint for fetching interview questions
 * Called by the Vapi workflow to get custom questions based on job details
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract params passed from the Vapi API request node
  const company = searchParams.get('company');
  const role = searchParams.get('role');
  const experience = searchParams.get('experience');
  const tech = searchParams.get('tech');
  
  // Log the incoming request for debugging
  console.log('Interview questions request:', { company, role, experience, tech });
  
  try {
    // Try to find matching preset questions based on company/role
    let questions: string[] = [];
    
    // See if we have a preset interview that matches the company and role
    const presets = Object.values(getPresetInterviewById);
    const matchingPreset = presets.find(
      (preset: { company?: string, role?: string, questions?: string[] }) => 
        preset?.company?.toLowerCase() === company?.toLowerCase() && 
        preset?.role?.toLowerCase().includes(role?.toLowerCase() || '')
    );
    
    if (matchingPreset?.questions?.length > 0) {
      questions = matchingPreset.questions;
      console.log('Found matching preset questions:', questions);
    } else {
      // Generate fallback questions based on role and experience
      // These are generic questions that work for most interviews
      questions = [
        `Tell me about your experience with ${tech || 'the technical skills required for this role'}.`,
        `Describe a challenging project you worked on as a ${role}.`,
        `How do you handle tight deadlines and pressure in your work?`,
        `What's your approach to working in a team versus working independently?`,
        `Where do you see yourself professionally in the next few years?`,
      ];
      
      // Add a role-specific question if we have the role
      if (role?.toLowerCase().includes('developer') || role?.toLowerCase().includes('engineer')) {
        questions.push('Can you walk me through your approach to debugging a complex technical issue?');
      } else if (role?.toLowerCase().includes('manager')) {
        questions.push('Tell me about a time you had to resolve a conflict between team members.');
      } else if (role?.toLowerCase().includes('designer')) {
        questions.push('How do you incorporate user feedback into your design process?');
      }
      
      console.log('Generated fallback questions for:', role);
    }

    // Return the questions in the expected format
    return NextResponse.json({ 
      success: true, 
      data: { 
        questions,
        company,
        role,
        experience,
        tech
      } 
    }, { 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Error fetching interview questions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch interview questions',
        fallback: {
          questions: [
            'Tell me about your background and experience.',
            'What interests you about this role?',
            'What are your key strengths and weaknesses?',
            'Tell me about a challenging situation you faced at work.',
            'Do you have any questions for me?'
          ]
        }
      }, 
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

/**
 * Handle POST requests for more complex question generation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, role, experience, tech, additionalContext } = body;
    
    console.log('POST interview questions request:', { company, role, experience, tech, additionalContext });
    
    // Similar logic to GET but can handle more complex data
    // For now, reuse the same question generation logic
    
    const questions: string[] = [
      `Tell me about your experience with ${tech || 'the technical skills required for this role'}.`,
      `What interests you about working at ${company}?`,
      `Describe a challenging project you worked on as a ${role}.`,
      `How do you handle tight deadlines and pressure in your work?`,
      `What's your approach to working in a team versus working independently?`,
      `Where do you see yourself professionally in the next few years?`,
    ];
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        questions,
        company,
        role,
        experience,
        tech 
      }
    }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error processing question generation request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate interview questions' 
      }, 
      { status: 500 }
    );
  }
}
