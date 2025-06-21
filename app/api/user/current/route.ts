import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.actions';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    return NextResponse.json({ 
      success: true, 
      user: user || null 
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get user',
      user: null 
    }, { status: 500 });
  }
}
