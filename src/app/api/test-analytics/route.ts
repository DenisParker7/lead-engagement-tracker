import { NextResponse } from 'next/server';
import { analytics } from '@/lib/analytics';

export async function GET() {
  try {
    const testUserId = 'test-user-123';
    const testProperties = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+1234567890',
      customFields: {
        source: 'API Test',
        role: 'Tester'
      }
    };

    // Test user identification
    await analytics.identifyUser(testUserId, testProperties);

    // Test event tracking
    await analytics.trackLeadActivity(testUserId, 'lead_created', {
      source: 'API Test',
      timestamp: new Date().toISOString()
    });

    // Test page view tracking
    await analytics.trackPageView(testUserId, 'Test Page', {
      url: '/test-page',
      referrer: 'API Test'
    });

    return NextResponse.json({
      success: true,
      message: 'Analytics integrations tested successfully'
    });

  } catch (error) {
    console.error('Analytics test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 