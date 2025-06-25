'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';

type Alert = {
  id: string;
  type: 'lead' | 'email' | 'call' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  person?: {
    name: string;
    role: string;
    company: string;
    imageUrl: string;
  };
};

const alerts: Alert[] = [
  {
    id: '1',
    type: 'lead',
    title: 'New Lead Created',
    description: 'A new lead has been created from website contact form',
    timestamp: '2024-02-15T10:00:00Z',
    isRead: false,
    person: {
      name: 'Sarah Thompson',
      role: 'Marketing Director',
      company: 'TechCorp Solutions',
      imageUrl: 'https://avatar.vercel.sh/sarah',
    },
  },
  {
    id: '2',
    type: 'email',
    title: 'Email Response Received',
    description: 'Lead has responded to your follow-up email',
    timestamp: '2024-02-15T09:30:00Z',
    isRead: true,
    person: {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'InnovateTech',
      imageUrl: 'https://avatar.vercel.sh/michael',
    },
  },
  {
    id: '3',
    type: 'warning',
    title: 'Lead Score Dropping',
    description: 'Lead engagement score has dropped below threshold',
    timestamp: '2024-02-15T09:00:00Z',
    isRead: false,
  },
  {
    id: '4',
    type: 'call',
    title: 'Scheduled Call Reminder',
    description: 'Upcoming call in 30 minutes',
    timestamp: '2024-02-15T08:30:00Z',
    isRead: true,
    person: {
      name: 'Emily Rodriguez',
      role: 'CEO',
      company: 'StartupX',
      imageUrl: 'https://avatar.vercel.sh/emily',
    },
  },
  {
    id: '5',
    type: 'success',
    title: 'Deal Won',
    description: 'Successfully closed deal with InnovateTech',
    timestamp: '2024-02-15T08:00:00Z',
    isRead: false,
  },
  {
    id: '6',
    type: 'info',
    title: 'System Update',
    description: 'New features have been added to the platform',
    timestamp: '2024-02-15T07:30:00Z',
    isRead: true,
  },
];

function getAlertIcon(type: Alert['type']) {
  switch (type) {
    case 'lead':
      return UserIcon;
    case 'email':
      return EnvelopeIcon;
    case 'call':
      return PhoneIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    case 'success':
      return CheckCircleIcon;
    case 'info':
      return InformationCircleIcon;
    default:
      return BellIcon;
  }
}

function getAlertTypeClasses(type: Alert['type']): string {
  switch (type) {
    case 'lead':
      return 'bg-primary/10 text-primary';
    case 'email':
      return 'bg-blue-100 text-blue-700';
    case 'call':
      return 'bg-warning/10 text-warning';
    case 'warning':
      return 'bg-error/10 text-error';
    case 'success':
      return 'bg-success/10 text-success';
    case 'info':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function AlertsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unread') {
      return !alert.isRead;
    }
    return true;
  });

  return (
    <div className="min-h-full">
      {/* Page header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Alerts</h1>
              <p className="mt-1 text-sm text-gray-500">
                Stay updated with important notifications
              </p>
            </div>
            <div className="flex items-center gap-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
                className="input"
              >
                <option value="all">All Alerts</option>
                <option value="unread">Unread</option>
              </select>
              <button type="button" className="btn-primary">
                Mark All as Read
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="card divide-y divide-gray-200">
            {filteredAlerts.length === 0 ? (
              <div className="p-6 text-center">
                <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No alerts
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You're all caught up! Check back later for new alerts.
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <div
                    key={alert.id}
                    className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                      !alert.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-x-4">
                      <div
                        className={`rounded-full p-2 ${getAlertTypeClasses(
                          alert.type
                        )}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="flex-auto">
                        <div className="flex items-start justify-between gap-x-4">
                          <div>
                            <div className="flex items-center gap-x-2">
                              <h2
                                className={`text-sm font-semibold leading-6 ${
                                  !alert.isRead ? 'text-gray-900' : 'text-gray-600'
                                }`}
                              >
                                {alert.title}
                              </h2>
                              {!alert.isRead && (
                                <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
                              )}
                            </div>
                            <p
                              className={`mt-1 text-sm ${
                                !alert.isRead
                                  ? 'text-gray-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              {alert.description}
                            </p>
                            {alert.person && (
                              <div className="mt-2 flex items-center gap-x-2">
                                <div className="relative h-6 w-6">
                                  <Image
                                    src={alert.person.imageUrl}
                                    alt=""
                                    fill
                                    className="rounded-full bg-gray-50 object-cover"
                                  />
                                </div>
                                <div className="text-xs text-gray-500">
                                  {alert.person.name} · {alert.person.role} at{' '}
                                  {alert.person.company}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-x-4">
                            <time
                              dateTime={alert.timestamp}
                              className="text-xs text-gray-500"
                            >
                              {new Date(alert.timestamp).toLocaleString()}
                            </time>
                            <button
                              type="button"
                              className="btn-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {alert.isRead ? 'Mark as Unread' : 'Mark as Read'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 