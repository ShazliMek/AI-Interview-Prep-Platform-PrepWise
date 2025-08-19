import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getCurrentUser } from '@/lib/actions/auth.actions';

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
    
    // Find all Meta interviews with incorrect logos
    const metaInterviews = await db.collection('completed_interviews')
      .find({ 
        company: { $regex: /meta/i }, // Case insensitive match for "meta"
        companyLogo: { $ne: '/covers/facebook.png' } // Logo is not facebook
      })
      .toArray();
    
    console.log(`Found ${metaInterviews.length} Meta interviews with incorrect logos`);
    
    // Tracking updates
    const updates = [];
    
    // Fix each interview
    for (const interview of metaInterviews) {
      const result = await db.collection('completed_interviews').updateOne(
        { _id: interview._id },
        { $set: { companyLogo: '/covers/facebook.png' } }
      );
      
      updates.push({
        id: interview.id,
        company: interview.company,
        oldLogo: interview.companyLogo,
        newLogo: '/covers/facebook.png',
        updated: result.modifiedCount > 0
      });
    }
    
    // Close connection
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: `Fixed ${updates.filter(u => u.updated).length} Meta interview records`,
      updated: updates
    });
  } catch (error) {
    console.error('Error fixing Meta interviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fix Meta interviews' }, 
      { status: 500 }
    );
  }
}
