import { Client } from '@hubspot/api-client';
import { ActivityType, TimeRange, EngagementMetrics, LeadScores, ConversionRates } from './types';

export class HubSpotAnalytics {
  private client: Client;

  constructor() {
    this.client = new Client({ accessToken: process.env.HUBSPOT_API_KEY });
  }

  async trackLeadActivity(leadId: string, activity: ActivityType): Promise<void> {
    try {
      // Create an engagement in HubSpot
      await this.client.crm.objects.notes.basicApi.create({
        properties: {
          hs_note_body: `Activity tracked: ${activity}`,
          hs_timestamp: Date.now(),
        },
        associations: [
          {
            to: { id: leadId },
            types: [{ category: 'HUBSPOT_DEFINED', typeId: 1 }],
          },
        ],
      });
    } catch (error) {
      console.error('Error tracking lead activity in HubSpot:', error);
      throw error;
    }
  }

  async getEngagementMetrics(timeRange: TimeRange): Promise<EngagementMetrics> {
    try {
      // Get contacts created in the time range
      const contactsResponse = await this.client.crm.contacts.searchApi.doSearch({
        filterGroups: [{
          filters: [{
            propertyName: 'createdate',
            operator: 'BETWEEN',
            value: `${timeRange.startDate.getTime()},${timeRange.endDate.getTime()}`,
          }],
        }],
        properties: ['createdate', 'hs_lead_status', 'source'],
        limit: 100,
      });

      // Calculate metrics
      const totalLeads = contactsResponse.total;
      const leadsByStatus: Record<string, number> = {};
      const leadsBySource: Record<string, number> = {};

      contactsResponse.results.forEach(contact => {
        const status = contact.properties.hs_lead_status;
        const source = contact.properties.source;
        
        if (status) {
          leadsByStatus[status] = (leadsByStatus[status] || 0) + 1;
        }
        if (source) {
          leadsBySource[source] = (leadsBySource[source] || 0) + 1;
        }
      });

      return {
        totalLeads,
        engagementRate: 0, // Requires additional calculation based on engagement events
        averageResponseTime: 0, // Requires additional calculation based on communication history
        conversionRate: 0, // Requires additional calculation based on deal stages
        leadsByStatus,
        leadsBySource,
        activityTimeline: [], // Requires additional calculation based on engagement events
      };
    } catch (error) {
      console.error('Error fetching engagement metrics from HubSpot:', error);
      throw error;
    }
  }

  async getLeadScores(): Promise<LeadScores> {
    // Implement lead scoring logic based on HubSpot properties and activities
    return {
      scores: [],
      averageScore: 0,
      distribution: {},
    };
  }

  async getConversionRates(timeRange: TimeRange): Promise<ConversionRates> {
    // Implement conversion rate calculations based on deal stages and contact activities
    return {
      overall: 0,
      bySource: {},
      byChannel: {},
      trend: [],
    };
  }
} 