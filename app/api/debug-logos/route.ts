import { NextResponse } from 'next/server';
import { getCompanyLogo } from '@/lib/utils/companyLogos';
import { getCurrentUser } from '@/lib/actions/auth.actions';

export async function GET() {
  try {
    // Ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // List of test company names to verify logo resolution
    const testCompanies = [
      'Meta',
      'Facebook',
      'meta',
      'facebook',
      'Google',
      'Microsoft',
      'Apple',
      'Amazon',
      'Netflix',
      'Adobe',
      'Spotify',
      'Twitter',
      'X',
      'TikTok',
      'ByteDance',
      'Quora',
      'Yahoo',
      'Skype',
      'Telegram',
      'LinkedIn',
      'GitHub',
      'Pinterest',
      'Uber',
      'Airbnb',
      'Stripe',
      'Dropbox',
      'Unknown Company',
      '',
      null
    ];

    // Get logo for each company
    const results = testCompanies.map(company => ({
      company,
      logo: getCompanyLogo(company as string),
      normalizedCompany: company ? company.trim().toLowerCase() : 'null'
    }));

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error in debug-logos endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to debug logos' },
      { status: 500 }
    );
  }
}
