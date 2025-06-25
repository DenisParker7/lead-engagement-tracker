import mixpanel from 'mixpanel-browser';
import { ActivityType, TimeRange, EngagementMetrics } from './types';

export class MixpanelAnalytics {
  constructor() {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '', {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    });
  }

  identify(userId: string, userProperties: Record<string, any>) {
    mixpanel.identify(userId);
    mixpanel.people.set(userProperties);
  }

  trackLeadActivity(leadId: string, activity: ActivityType, properties: Record<string, any> = {}) {
    mixpanel.track(activity, {
      leadId,
      timestamp: new Date().toISOString(),
      ...properties,
    });
  }

  async getEngagementMetrics(timeRange: TimeRange): Promise<Partial<EngagementMetrics>> {
    // Note: This would typically be implemented on the server side
    // using Mixpanel's JQL (JSON Query Language) API
    // Here we're just returning a placeholder
    return {
      activityTimeline: [],
      engagementRate: 0,
    };
  }

  trackPageView(pageName: string, properties: Record<string, any> = {}) {
    mixpanel.track('page_viewed', {
      page: pageName,
      ...properties,
    });
  }

  setUserProperties(properties: Record<string, any>) {
    mixpanel.people.set(properties);
  }

  incrementUserProperty(property: string, value: number = 1) {
    mixpanel.people.increment(property, value);
  }
} 