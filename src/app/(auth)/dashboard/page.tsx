'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { analytics, type EngagementMetrics } from '@/lib/analytics';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  BoltIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

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
  icon: any;
  description: string;
}

const stats: Stat[] = [
  {
    name: 'Total Leads',
    value: '2,651',
    change: '+12.5%',
    changeType: 'positive',
    metricKey: 'totalLeads',
    icon: UserIcon,
    description: 'Active leads in your pipeline',
  },
  {
    name: 'Engagement Rate',
    value: '58.6%',
    change: '+5.4%',
    changeType: 'positive',
    metricKey: 'engagementRate',
    icon: CursorArrowRaysIcon,
    description: 'Leads actively engaging with content',
  },
  {
    name: 'Average Response Time',
    value: '2.4h',
    change: '-0.3h',
    changeType: 'positive',
    metricKey: 'averageResponseTime',
    icon: BoltIcon,
    description: 'Time to first response',
  },
  {
    name: 'Conversion Rate',
    value: '24.3%',
    change: '-2.1%',
    changeType: 'negative',
    metricKey: 'conversionRate',
    icon: ChartBarIcon,
    description: 'Leads converted to customers',
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
    icon: EnvelopeIcon,
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
    icon: PhoneIcon,
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
    icon: UserIcon,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  async function fetchMetrics() {
    setIsLoading(true);
    const endDate = new Date();
    const startDate = new Date();
    
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
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  function getActivityTypeClasses(type: string): string {
    switch (type) {
      case 'lead':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'email':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'call':
        return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      default:
        return '';
    }
  }

  return (
    <div className="min-h-full bg-gray-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Here's what's happening with your leads today
          </p>
        </div>

        {/* Time range selector and refresh */}
        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Time period:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-0 bg-white py-1.5 pl-3 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          <button
            onClick={() => fetchMetrics()}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-3 w-3 flex-shrink-0" />
            Refresh data
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-6 py-5 shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow duration-200"
            >
              <dt>
                <div className={classNames(
                  stat.changeType === 'positive' ? 'bg-emerald-50' : 'bg-rose-50',
                  'absolute rounded-lg p-2'
                )}>
                  <div className="flex h-8 w-8 items-center justify-center">
                    <stat.icon
                      className={classNames(
                        stat.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600',
                        'h-4 w-4 flex-shrink-0'
                      )}
                      aria-hidden="true"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </div>
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-600">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex flex-col gap-y-1.5">
                <p className="text-2xl font-semibold tracking-tight text-gray-900">
                  {stat.value}
                </p>
                <div className="flex items-baseline">
                  <p
                    className={classNames(
                      stat.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600',
                      'flex items-baseline text-sm font-medium'
                    )}
                  >
                    <span className="flex items-center gap-x-1">
                      {stat.changeType === 'positive' ? (
                        <ArrowUpIcon 
                          className="h-3 w-3 flex-shrink-0 max-w-[12px] max-h-[12px]" 
                          aria-hidden="true"
                          width={12}
                          height={12}
                          viewBox="0 0 24 24"
                          preserveAspectRatio="xMidYMid meet"
                        />
                      ) : (
                        <ArrowDownIcon 
                          className="h-3 w-3 flex-shrink-0 max-w-[12px] max-h-[12px]" 
                          aria-hidden="true"
                          width={12}
                          height={12}
                          viewBox="0 0 24 24"
                          preserveAspectRatio="xMidYMid meet"
                        />
                      )}
                      {stat.change}
                    </span>
                  </p>
                  <span className="text-sm text-gray-500 ml-2">vs previous period</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </dd>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-4 flow-root">
            <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
              <ul role="list" className="divide-y divide-gray-100">
                {recentActivity.map((activity) => (
                  <li
                    key={activity.id}
                    className="relative flex items-center gap-x-4 px-6 py-4 hover:bg-gray-50 sm:px-6"
                  >
                    <div 
                      className={`${getActivityTypeClasses(activity.type)} rounded-lg p-2 ring-1 ring-inset`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center">
                        <activity.icon 
                          className="h-4 w-4 flex-shrink-0 text-gray-600" 
                          aria-hidden="true"
                          width={16}
                          height={16}
                          viewBox="0 0 24 24"
                          preserveAspectRatio="xMidYMid meet"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-auto">
                      <div className="flex items-center gap-x-3">
                        <p className="text-sm font-medium leading-6 text-gray-900">
                          {activity.person.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {activity.person.role} at {activity.person.company}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        <p className="whitespace-nowrap">
                          {activity.action}
                        </p>
                        <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                          <circle cx={1} cy={1} r={1} />
                        </svg>
                        <p className="truncate">{activity.timestamp}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 