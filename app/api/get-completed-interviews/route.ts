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
    
    // Get completed interviews for this user
    const completedInterviews = await db.collection('completed_interviews')
      .find({ userId: user.id })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(10)
      .toArray();
    
    // Close connection
    await client.close();
    
    return NextResponse.json({
      success: true,
      interviews: completedInterviews
    });
  } catch (error) {
    console.error('Error fetching completed interviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch interviews' }, 
      { status: 500 }
    );
  }
}
