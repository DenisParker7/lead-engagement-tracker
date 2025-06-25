import { HubSpotAnalytics } from './hubspot';
import { MixpanelAnalytics } from './mixpanel';
import { ActivityType, TimeRange, EngagementMetrics, LeadScores, ConversionRates } from './types';

class AnalyticsService {
  private hubspot: HubSpotAnalytics;
  private mixpanel: MixpanelAnalytics;

  constructor() {
    this.hubspot = new HubSpotAnalytics();
    this.mixpanel = new MixpanelAnalytics();
  }

  async trackLeadActivity(leadId: string, activity: ActivityType, properties: Record<string, any> = {}) {
    // Track in both systems
    await Promise.all([
      this.hubspot.trackLeadActivity(leadId, activity),
      this.mixpanel.trackLeadActivity(leadId, activity, properties),
    ]);
  }

  async getEngagementMetrics(timeRange: TimeRange): Promise<EngagementMetrics> {
    // Get metrics from both systems
    const [hubspotMetrics, mixpanelMetrics] = await Promise.all([
      this.hubspot.getEngagementMetrics(timeRange),
      this.mixpanel.getEngagementMetrics(timeRange),
    ]);

    // Combine and enrich metrics
    return {
      ...hubspotMetrics,
      engagementRate: mixpanelMetrics.engagementRate || hubspotMetrics.engagementRate,
      activityTimeline: mixpanelMetrics.activityTimeline || hubspotMetrics.activityTimeline,
    };
  }

  async getLeadScores(): Promise<LeadScores> {
    return this.hubspot.getLeadScores();
  }

  async getConversionRates(timeRange: TimeRange): Promise<ConversionRates> {
    return this.hubspot.getConversionRates(timeRange);
  }

  // User identification and tracking
  identifyUser(userId: string, userProperties: Record<string, any>) {
    this.mixpanel.identify(userId, userProperties);
  }

  trackPageView(pageName: string, properties: Record<string, any> = {}) {
    this.mixpanel.trackPageView(pageName, properties);
  }
}

// Create a singleton instance
export const analytics = new AnalyticsService();

// Export types
export type { ActivityType, TimeRange, EngagementMetrics, LeadScores, ConversionRates }; 