export type TimeRange = {
  startDate: Date;
  endDate: Date;
};

export type ActivityType = 
  | 'email_opened'
  | 'email_clicked'
  | 'meeting_scheduled'
  | 'form_submitted'
  | 'page_viewed'
  | 'lead_created'
  | 'lead_converted';

export type EngagementMetrics = {
  totalLeads: number;
  engagementRate: number;
  averageResponseTime: number;
  conversionRate: number;
  leadsBySource: Record<string, number>;
  leadsByStatus: Record<string, number>;
  activityTimeline: Array<{
    date: string;
    activities: number;
  }>;
};

export type LeadScore = {
  leadId: string;
  score: number;
  factors: Array<{
    name: string;
    impact: number;
  }>;
};

export type LeadScores = {
  scores: LeadScore[];
  averageScore: number;
  distribution: Record<string, number>;
};

export type ConversionRates = {
  overall: number;
  bySource: Record<string, number>;
  byChannel: Record<string, number>;
  trend: Array<{
    date: string;
    rate: number;
  }>;
};

export interface AnalyticsService {
  trackEvent(userId: string, event: string, properties: Record<string, any>): Promise<void>;
  identifyUser(userId: string, traits: Record<string, any>): Promise<void>;
  page(userId: string, name: string, properties: Record<string, any>): Promise<void>;
} 