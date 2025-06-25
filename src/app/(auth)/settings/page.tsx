'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  UserIcon,
  BellIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const notificationSettings = [
  {
    id: 'new-leads',
    name: 'New Leads',
    description: 'Get notified when a new lead is created',
    checked: true,
  },
  {
    id: 'lead-updates',
    name: 'Lead Updates',
    description: 'Get notified when a lead status changes',
    checked: true,
  },
  {
    id: 'engagement-alerts',
    name: 'Engagement Alerts',
    description: 'Get notified when lead engagement score changes significantly',
    checked: false,
  },
  {
    id: 'task-reminders',
    name: 'Task Reminders',
    description: 'Get reminders for upcoming tasks and follow-ups',
    checked: true,
  },
];

const thresholdSettings = [
  {
    id: 'engagement-threshold',
    name: 'Engagement Score Threshold',
    description: 'Minimum score to mark a lead as engaged',
    value: 75,
    min: 0,
    max: 100,
    step: 5,
  },
  {
    id: 'response-time',
    name: 'Response Time Threshold',
    description: 'Maximum hours to respond to a lead',
    value: 24,
    min: 1,
    max: 72,
    step: 1,
  },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'company', name: 'Company', icon: BuildingOfficeIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'thresholds', name: 'Thresholds', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-full">
      {/* Page header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences and configurations
            </p>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <nav className="col-span-12 lg:col-span-3">
              <div className="card p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon
                      className={`h-5 w-5 ${
                        activeTab === tab.id
                          ? 'text-primary'
                          : 'text-gray-400 group-hover:text-primary'
                      }`}
                    />
                    {tab.name}
                  </button>
                ))}
              </div>
            </nav>

            {/* Main content */}
            <main className="col-span-12 lg:col-span-9">
              <div className="card divide-y divide-gray-200">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Profile Settings
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Update your personal information and preferences
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Full Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={session?.user?.name || ''}
                            className="input"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Email
                        </label>
                        <div className="mt-2">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            defaultValue={session?.user?.email || ''}
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Company Settings */}
                {activeTab === 'company' && (
                  <div className="p-6">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Company Settings
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Update your company information and branding
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="company-name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Company Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="company-name"
                            id="company-name"
                            className="input"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="website"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Website
                        </label>
                        <div className="mt-2">
                          <input
                            type="url"
                            name="website"
                            id="website"
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Notification Settings
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Choose what notifications you want to receive
                    </p>
                    <div className="mt-6 divide-y divide-gray-200">
                      {notificationSettings.map((setting) => (
                        <div
                          key={setting.id}
                          className="flex items-start py-4"
                        >
                          <div className="flex h-6 items-center">
                            <input
                              id={setting.id}
                              name={setting.id}
                              type="checkbox"
                              defaultChecked={setting.checked}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                          <div className="ml-3">
                            <label
                              htmlFor={setting.id}
                              className="text-sm font-medium leading-6 text-gray-900"
                            >
                              {setting.name}
                            </label>
                            <p className="text-sm text-gray-500">
                              {setting.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Threshold Settings */}
                {activeTab === 'thresholds' && (
                  <div className="p-6">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Threshold Settings
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Configure system thresholds and triggers
                    </p>
                    <div className="mt-6 divide-y divide-gray-200">
                      {thresholdSettings.map((setting) => (
                        <div
                          key={setting.id}
                          className="py-4"
                        >
                          <div className="flex justify-between">
                            <label
                              htmlFor={setting.id}
                              className="text-sm font-medium leading-6 text-gray-900"
                            >
                              {setting.name}
                            </label>
                            <span className="text-sm text-gray-500">
                              {setting.value}
                              {setting.id === 'response-time' ? ' hours' : '%'}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {setting.description}
                          </p>
                          <input
                            type="range"
                            id={setting.id}
                            name={setting.id}
                            min={setting.min}
                            max={setting.max}
                            step={setting.step}
                            defaultValue={setting.value}
                            className="mt-4 w-full accent-primary"
                          />
                          <div className="mt-1 flex justify-between text-xs text-gray-500">
                            <span>
                              {setting.min}
                              {setting.id === 'response-time' ? ' hours' : '%'}
                            </span>
                            <span>
                              {setting.max}
                              {setting.id === 'response-time' ? ' hours' : '%'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-x-4 p-6">
                  <button type="button" className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
} 