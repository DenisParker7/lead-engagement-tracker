import { AnalyticsService } from './types';

interface FreshsalesConfig {
  apiKey: string;
  bundleAlias: string;
}

export class FreshsalesAnalytics implements AnalyticsService {
  private apiKey: string;
  private bundleAlias: string;
  private baseUrl: string;

  constructor(config: FreshsalesConfig) {
    this.apiKey = config.apiKey;
    this.bundleAlias = config.bundleAlias;
    this.baseUrl = `https://${this.bundleAlias}/api`;
  }

  private async makeRequest(endpoint: string, method: string, data?: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Token token=${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Freshsales API error:', errorText);
      throw new Error(`Freshsales API error: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async trackEvent(userId: string, event: string, properties: Record<string, any>): Promise<void> {
    // Create a sales activity to track the event
    await this.makeRequest('/sales_activities', 'POST', {
      sales_activity: {
        title: event,
        notes: JSON.stringify(properties),
        targetable_type: 'Contact',
        targetable_id: userId,
      }
    });
  }

  async identifyUser(userId: string, traits: Record<string, any>): Promise<void> {
    // Create or update a contact
    await this.makeRequest('/contacts/upsert', 'POST', {
      unique_identifier: { external_id: userId },
      contact: {
        first_name: traits.firstName,
        last_name: traits.lastName,
        email: traits.email,
        mobile_number: traits.phone,
        custom_field: traits.customFields,
      }
    });
  }

  async page(userId: string, name: string, properties: Record<string, any>): Promise<void> {
    // Track page view as a sales activity
    await this.makeRequest('/sales_activities', 'POST', {
      sales_activity: {
        title: `Page View: ${name}`,
        notes: JSON.stringify(properties),
        targetable_type: 'Contact',
        targetable_id: userId,
      }
    });
  }
} 