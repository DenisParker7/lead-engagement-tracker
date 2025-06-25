import { HubSpotAnalytics } from './hubspot';
import { MixpanelAnalytics } from './mixpanel';
import { FreshsalesAnalytics } from './freshsales';
import { ActivityType, TimeRange, EngagementMetrics, LeadScores, ConversionRates } from './types';

class AnalyticsService {
  private hubspot: HubSpotAnalytics;
  private mixpanel: MixpanelAnalytics;
  private freshsales: FreshsalesAnalytics;

  constructor() {
    this.hubspot = new HubSpotAnalytics();
    this.mixpanel = new MixpanelAnalytics();
    this.freshsales = new FreshsalesAnalytics({
      apiKey: process.env.FRESHSALES_API_KEY!,
      bundleAlias: process.env.FRESHSALES_BUNDLE_ALIAS!
    });
  }

  async trackLeadActivity(leadId: string, activity: ActivityType, properties: Record<string, any> = {}) {
    // Track in all systems
    await Promise.all([
      this.hubspot.trackLeadActivity(leadId, activity),
      this.mixpanel.trackLeadActivity(leadId, activity, properties),
      this.freshsales.trackEvent(leadId, activity, properties),
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
  async identifyUser(userId: string, userProperties: Record<string, any>) {
    await Promise.all([
      this.mixpanel.identify(userId, userProperties),
      this.freshsales.identifyUser(userId, userProperties)
    ]);
  }

  async trackPageView(userId: string, pageName: string, properties: Record<string, any> = {}) {
    await Promise.all([
      this.mixpanel.trackPageView(pageName, properties),
      this.freshsales.page(userId, pageName, properties)
    ]);
  }
}

// Create a singleton instance
export const analytics = new AnalyticsService();

// Export types
export type { ActivityType, TimeRange, EngagementMetrics, LeadScores, ConversionRates };

export * from './types';
export * from './hubspot';
export * from './mixpanel';
export * from './freshsales'; 