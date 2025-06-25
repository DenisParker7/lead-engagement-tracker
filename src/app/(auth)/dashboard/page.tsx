'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { analytics, type EngagementMetrics } from '@/lib/analytics';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  companyId?: string;
  companyName?: string;
}

interface Stat {
  name: string;
  value: string | number;
  change: string;
  changeType: string;
  metricKey: keyof EngagementMetrics;
}

// Custom icon components
const Icons = {
  ChevronUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  ),
  User: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  Email: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  Phone: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  ),
  Clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  )
};

const stats: Stat[] = [
  {
    name: 'Total Leads',
    value: '2,651',
    change: '+12.5%',
    changeType: 'positive',
    metricKey: 'totalLeads',
  },
  {
    name: 'Engagement Rate',
    value: '58.6%',
    change: '+5.4%',
    changeType: 'positive',
    metricKey: 'engagementRate',
  },
  {
    name: 'Average Response Time',
    value: '2.4h',
    change: '-0.3h',
    changeType: 'positive',
    metricKey: 'averageResponseTime',
  },
  {
    name: 'Conversion Rate',
    value: '24.3%',
    change: '-2.1%',
    changeType: 'negative',
    metricKey: 'conversionRate',
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'email',
    person: {
      name: 'Sarah Thompson',
      role: 'Marketing Director',
      company: 'TechCorp Solutions',
      imageUrl: 'https://avatar.vercel.sh/sarah',
    },
    action: 'replied to your email',
    timestamp: '2 hours ago',
    icon: Icons.Email,
  },
  {
    id: 2,
    type: 'call',
    person: {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'InnovateTech',
      imageUrl: 'https://avatar.vercel.sh/michael',
    },
    action: 'scheduled a call',
    timestamp: '4 hours ago',
    icon: Icons.Phone,
  },
  {
    id: 3,
    type: 'lead',
    person: {
      name: 'Emily Rodriguez',
      role: 'CEO',
      company: 'StartupX',
      imageUrl: 'https://avatar.vercel.sh/emily',
    },
    action: 'became a new lead',
    timestamp: '6 hours ago',
    icon: Icons.User,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getActivityTypeClasses(type: string): string {
  switch (type) {
    case 'lead':
      return 'bg-success/10 text-success';
    case 'email':
      return 'bg-primary/10 text-primary';
    case 'call':
      return 'bg-warning/10 text-warning';
    default:
      return '';
  }
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);

  useEffect(() => {
    // Track page view
    analytics.trackPageView('dashboard');

    // Identify user if available
    if (session?.user) {
      const user = session.user as ExtendedUser;
      analytics.identifyUser(user.id, {
        name: user.name,
        email: user.email,
        companyId: user.companyId,
        companyName: user.companyName,
      });
    }
  }, [session]);

  useEffect(() => {
    async function fetchMetrics() {
      const endDate = new Date();
      const startDate = new Date();
      
      // Adjust start date based on selected time range
      switch (timeRange) {
        case '24h':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      try {
        const data = await analytics.getEngagementMetrics({ startDate, endDate });
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }

    fetchMetrics();
  }, [timeRange]);

  // Track activity when user interacts with items
  const handleActivityClick = (activity: any) => {
    analytics.trackLeadActivity(activity.person.id, 'page_viewed', {
      activityType: activity.type,
      activityId: activity.id,
    });
  };

  return (
    <div className="min-h-full">
      {/* Page header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Here's what's happening with your leads today
              </p>
            </div>
            <div className="flex items-center gap-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                type="button"
                className="btn-primary"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="card p-6">
                <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
                <dd className="mt-2 flex items-baseline justify-between md:block lg:flex">
                  <div className="flex items-baseline text-2xl font-semibold text-gray-900">
                    {metrics ? String(metrics[stat.metricKey]) : stat.value}
                  </div>
                  <div
                    className={classNames(
                      stat.changeType === 'positive'
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error',
                      'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                    )}
                  >
                    <span className="mr-1">
                      {stat.changeType === 'positive' ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                    </span>
                    <span>{stat.change}</span>
                  </div>
                </dd>
              </div>
            ))}
          </div>

          {/* Activity feed */}
          <div className="mt-8">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Recent Activity
            </h2>
            <div className="mt-4 card divide-y divide-gray-200">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleActivityClick(item)}
                >
                  <div className="flex items-center gap-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.person.imageUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="rounded-full bg-gray-50 object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {item.person.name}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {item.person.role} at {item.person.company}
                          </p>
                        </div>
                        <div className="ml-4 flex flex-shrink-0 items-center gap-x-4">
                          <div
                            className={classNames(
                              'inline-flex items-center gap-x-1 rounded-full px-2 py-1 text-xs font-medium',
                              getActivityTypeClasses(item.type)
                            )}
                          >
                            <span className="flex items-center">
                              <item.icon />
                            </span>
                            <span>{item.type}</span>
                          </div>
                          <time
                            dateTime={item.timestamp}
                            className="text-xs text-gray-500 whitespace-nowrap"
                          >
                            {item.timestamp}
                          </time>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-x-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Icons.Clock />
                        </span>
                        <span className="truncate">{item.action}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 self-center">
                      <Icons.ChevronRight />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 