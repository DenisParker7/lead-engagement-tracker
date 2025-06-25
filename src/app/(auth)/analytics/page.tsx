'use client';

import { useState } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const metrics = [
  {
    name: 'Total Leads',
    value: '2,651',
    change: '+12.5%',
    changeType: 'positive',
    icon: UsersIcon,
  },
  {
    name: 'Conversion Rate',
    value: '24.3%',
    change: '-2.1%',
    changeType: 'negative',
    icon: ChartBarIcon,
  },
  {
    name: 'Average Deal Size',
    value: '$48.2K',
    change: '+8.3%',
    changeType: 'positive',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Sales Cycle',
    value: '28 days',
    change: '-3 days',
    changeType: 'positive',
    icon: ClockIcon,
  },
];

const leadsBySource = [
  { source: 'Website', value: 35 },
  { source: 'Referral', value: 25 },
  { source: 'Social Media', value: 20 },
  { source: 'Email', value: 15 },
  { source: 'Other', value: 5 },
];

const leadsByStage = [
  { stage: 'New', value: 150 },
  { stage: 'Contacted', value: 89 },
  { stage: 'Qualified', value: 45 },
  { stage: 'Proposal', value: 23 },
  { stage: 'Negotiation', value: 12 },
  { stage: 'Won', value: 8 },
  { stage: 'Lost', value: 15 },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="min-h-full">
      {/* Page header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and analyze your sales performance
              </p>
            </div>
            <div className="flex items-center gap-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button type="button" className="btn-primary">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Key metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="card p-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">
                    {metric.name}
                  </dt>
                  <dd>
                    <metric.icon className="h-5 w-5 text-gray-400" />
                  </dd>
                </div>
                <dd className="mt-2">
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-semibold text-gray-900">
                      {metric.value}
                    </div>
                    <div
                      className={classNames(
                        metric.changeType === 'positive'
                          ? 'bg-success/10 text-success'
                          : 'bg-error/10 text-error',
                        'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium'
                      )}
                    >
                      {metric.changeType === 'positive' ? (
                        <ArrowUpIcon
                          className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowDownIcon
                          className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      {metric.change}
                    </div>
                  </div>
                </dd>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Leads by Source */}
            <div className="card p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Leads by Source
              </h3>
              <div className="mt-6">
                <ul role="list" className="divide-y divide-gray-200">
                  {leadsBySource.map((item) => (
                    <li key={item.source} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.source}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center gap-x-2">
                          <div className="text-sm text-gray-500">
                            {item.value}%
                          </div>
                          <div className="relative w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-primary rounded-full"
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Leads by Stage */}
            <div className="card p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Leads by Stage
              </h3>
              <div className="mt-6">
                <ul role="list" className="divide-y divide-gray-200">
                  {leadsByStage.map((item) => (
                    <li key={item.stage} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.stage}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center gap-x-2">
                          <div className="text-sm text-gray-500">
                            {item.value} leads
                          </div>
                          <div className="relative w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-primary rounded-full"
                              style={{
                                width: `${
                                  (item.value /
                                    Math.max(
                                      ...leadsByStage.map((s) => s.value)
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
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
    </div>
  );
} 