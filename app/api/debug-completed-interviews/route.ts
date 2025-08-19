import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getCurrentUser } from '@/lib/actions/auth.actions';
import { getCompanyLogo } from '@/lib/utils/companyLogos';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    // Connect to DB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db('prepwise');
    
    // Get completed interviews for this user
    const completedInterviews = await db.collection('completed_interviews')
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Add debug info for each interview
    const debugInterviews = completedInterviews.map(interview => {
      const { company, companyLogo } = interview;
      const normalizedCompany = company ? company.trim().toLowerCase() : '';
      const expectedLogo = getCompanyLogo(company);
      const isLogoCorrect = companyLogo === expectedLogo;
      
      return {
        ...interview,
        debug: {
          normalizedCompany,
          expectedLogo,
          actualLogo: companyLogo,
          isLogoCorrect
        }
      };
    });
    
    // Close connection
    await client.close();
    
    return NextResponse.json({
      success: true,
      interviews: debugInterviews
    });
  } catch (error) {
    console.error('Error fetching debug completed interviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch interviews debug info' }, 
      { status: 500 }
    );
  }
}
