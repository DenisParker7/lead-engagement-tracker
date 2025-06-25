'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';

type Lead = {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  lastContact: string;
  score: number;
};

const leads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Thompson',
    title: 'Marketing Director',
    company: 'TechCorp Solutions',
    email: 'sarah.t@techcorp.com',
    phone: '+1 (555) 123-4567',
    status: 'Qualified',
    lastContact: '2024-02-15',
    score: 85,
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Product Manager',
    company: 'InnovateTech',
    email: 'm.chen@innovatetech.com',
    phone: '+1 (555) 234-5678',
    status: 'Contacted',
    lastContact: '2024-02-14',
    score: 65,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'CEO',
    company: 'StartupX',
    email: 'emily@startupx.com',
    phone: '+1 (555) 345-6789',
    status: 'New',
    lastContact: '2024-02-13',
    score: 45,
  },
  // Add more sample leads as needed
];

const statuses = ['All', 'Active', 'In Progress', 'Closed', 'Lost'];

type SortConfig = {
  key: keyof Lead;
  direction: 'asc' | 'desc';
} | null;

function getStatusColor(status: Lead['status']): string {
  switch (status) {
    case 'New':
      return 'bg-gray-100 text-gray-700';
    case 'Contacted':
      return 'bg-blue-100 text-blue-700';
    case 'Qualified':
      return 'bg-green-100 text-green-700';
    case 'Proposal':
      return 'bg-yellow-100 text-yellow-700';
    case 'Negotiation':
      return 'bg-purple-100 text-purple-700';
    case 'Won':
      return 'bg-success/10 text-success';
    case 'Lost':
      return 'bg-error/10 text-error';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-error';
}

export default function LeadsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  const [selectedStatus, setSelectedStatus] = useState<Lead['status'] | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleSort = (key: keyof Lead) => {
    setSortConfig((currentSort) => {
      if (currentSort?.key === key) {
        return currentSort.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: keyof Lead) => {
    if (sortConfig?.key !== key) {
      return <ChevronUpDownIcon className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
    );
  };

  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="min-h-full">
      {/* Page header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track your sales pipeline
              </p>
            </div>
            <div>
              <button type="button" className="btn-primary">
                Add New Lead
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <FunnelIcon
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Lead['status'] | 'All')}
                  className="input"
                >
                  <option value="All">All Status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredLeads.length} leads
            </div>
          </div>

          {/* Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-x-2">
                        <span>Name</span>
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('company')}
                    >
                      <div className="flex items-center gap-x-2">
                        <span>Company</span>
                        {getSortIcon('company')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-x-2">
                        <span>Status</span>
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('score')}
                    >
                      <div className="flex items-center gap-x-2">
                        <span>Score</span>
                        {getSortIcon('score')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('lastContact')}
                    >
                      <div className="flex items-center gap-x-2">
                        <span>Last Contact</span>
                        {getSortIcon('lastContact')}
                      </div>
                    </th>
                    <th scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="group">
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">
                            {lead.name}
                          </div>
                          <div className="text-gray-500">{lead.title}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">
                            {lead.company}
                          </div>
                          <div className="text-gray-500">{lead.email}</div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <span className={`font-medium ${getScoreColor(lead.score)}`}>
                          {lead.score}%
                        </span>
                      </td>
                      <td>
                        <time dateTime={lead.lastContact}>
                          {new Date(lead.lastContact).toLocaleDateString()}
                        </time>
                      </td>
                      <td>
                        <div className="flex justify-end gap-x-3">
                          <button
                            type="button"
                            className="btn-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-danger opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 