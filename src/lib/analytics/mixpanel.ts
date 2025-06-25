import mixpanel from 'mixpanel-browser';
import { ActivityType, TimeRange, EngagementMetrics, AnalyticsService } from './types';

export class MixpanelAnalytics implements AnalyticsService {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    if (this.isClient) {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '', {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: true,
        persistence: 'localStorage',
      });
    }
  }

  private checkEnvironment() {
    if (!this.isClient) {
      console.warn('Mixpanel tracking attempted on server side - skipping');
      return false;
    }
    return true;
  }

  async trackEvent(userId: string, event: string, properties: Record<string, any>): Promise<void> {
    if (!this.checkEnvironment()) return;
    
    mixpanel.track(event, {
      distinct_id: userId,
      ...properties
    });
  }

  async identifyUser(userId: string, traits: Record<string, any>): Promise<void> {
    if (!this.checkEnvironment()) return;

    mixpanel.identify(userId);
    mixpanel.people.set({
      $name: `${traits.firstName} ${traits.lastName}`,
      $email: traits.email,
      $phone: traits.phone,
      ...traits.customFields
    });
  }

  async page(userId: string, name: string, properties: Record<string, any>): Promise<void> {
    if (!this.checkEnvironment()) return;

    mixpanel.track('Page View', {
      distinct_id: userId,
      page_name: name,
      ...properties
    });
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