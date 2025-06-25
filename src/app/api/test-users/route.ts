import { NextResponse } from 'next/server';
import { FreshsalesAnalytics } from '@/lib/analytics/freshsales';

export async function POST(request: Request) {
  try {
    // Log environment variables (without sensitive values)
    console.log('FRESHSALES_BUNDLE_ALIAS:', process.env.FRESHSALES_BUNDLE_ALIAS);
    console.log('FRESHSALES_API_KEY length:', process.env.FRESHSALES_API_KEY?.length);

    if (!process.env.FRESHSALES_API_KEY || !process.env.FRESHSALES_BUNDLE_ALIAS) {
      throw new Error('Missing required Freshsales configuration');
    }

    // Initialize Freshsales
    const freshsales = new FreshsalesAnalytics({
      apiKey: process.env.FRESHSALES_API_KEY,
      bundleAlias: process.env.FRESHSALES_BUNDLE_ALIAS
    });

    // Test user data
    const testUser = {
      userId: 'test-' + Date.now(), // Unique ID using timestamp
      traits: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        customFields: {
          source: 'Test API',
          role: 'Test User'
        }
      }
    };

    console.log('Attempting to create test user:', { ...testUser, userId: '***' });

    // Test Freshsales
    await freshsales.identifyUser(testUser.userId, testUser.traits);

    console.log('Successfully created test user in Freshsales');

    return NextResponse.json({
      success: true,
      message: 'Test user created in Freshsales successfully',
      testUser
    });

  } catch (error) {
    console.error('Test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      config: {
        bundleAlias: process.env.FRESHSALES_BUNDLE_ALIAS,
        hasApiKey: !!process.env.FRESHSALES_API_KEY
      }
    }, { status: 500 });
  }
} 