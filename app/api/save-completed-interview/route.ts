import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getCurrentUser } from '@/lib/actions/auth.actions';
import { getCompanyLogo } from '@/lib/utils/companyLogos';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    const data = await request.json();
    const { 
      interviewId, 
      role, 
      type = 'custom',
      company = 'Not specified', 
      techstack = [], 
      level = 'Not specified' 
    } = data;
    
    if (!interviewId || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Connect to DB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db('prepwise');
    
    // Create a completed interview record
    let companyLogo;
    
    // Special case for Meta to ensure we always use the facebook logo
    if (company.trim().toLowerCase() === 'meta') {
      companyLogo = '/covers/facebook.png';
      console.log(`Meta special case detected: forcing Facebook logo`);
    } else {
      companyLogo = getCompanyLogo(company);
    }
    
    console.log(`Company: ${company}, Selected logo: ${companyLogo}`);
    
    const completedInterview = {
      id: interviewId,
      userId: user.id,
      role,
      type,
      company,
      techstack,
      level,
      finalized: true,
      createdAt: new Date().toISOString(),
      companyLogo, // Get correct logo for company
      description: `${type} interview for a ${level} ${role} position at ${company}`
    };
    
    // Save to database
    await db.collection('completed_interviews').insertOne(completedInterview);
    
    // Close connection
    await client.close();
    
    return NextResponse.json({ 
      success: true, 
      interview: completedInterview 
    });
  } catch (error) {
    console.error('Error saving completed interview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save interview' }, 
      { status: 500 }
    );
  }
}
