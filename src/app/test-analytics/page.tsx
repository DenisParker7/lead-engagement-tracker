'use client';

import { useEffect } from 'react';
import { MixpanelAnalytics } from '@/lib/analytics/mixpanel';

export default function TestAnalytics() {
  useEffect(() => {
    const testMixpanel = async () => {
      const mixpanel = new MixpanelAnalytics();
      const testUser = {
        userId: 'test-' + Date.now(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        customFields: {
          source: 'Test Page',
          role: 'Test User'
        }
      };

      try {
        await mixpanel.identifyUser(testUser.userId, testUser);
        await mixpanel.trackEvent(testUser.userId, 'Test Event', { source: 'Test Page' });
        await mixpanel.page(testUser.userId, 'Test Page', { url: '/test-analytics' });
        console.log('Mixpanel test successful');
      } catch (error) {
        console.error('Mixpanel test failed:', error);
      }
    };

    testMixpanel();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Test Page</h1>
      <p>Check the console for test results.</p>
      <p>Also check:</p>
      <ul className="list-disc ml-6">
        <li>Mixpanel dashboard for user events</li>
        <li>Freshsales contacts for new test users</li>
      </ul>
    </div>
  );
} 