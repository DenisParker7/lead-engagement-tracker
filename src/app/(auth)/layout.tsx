'use client';

import { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Leads', href: '/leads', icon: UserGroupIcon },
  { name: 'Alerts', href: '/alerts', icon: BellIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartPieIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const userNavigation = [
  { name: 'Your Profile', href: '/settings' },
  { name: 'Company Settings', href: '/settings/company' },
  { name: 'Sign out', href: '#', onClick: () => signOut() },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-5 pb-4">
                  <div className="flex h-14 shrink-0 items-center border-b">
                    <span className="flex items-center gap-x-2">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <ChartBarIcon 
                          className="h-5 w-5 flex-shrink-0 text-primary max-w-[20px] max-h-[20px]" 
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          preserveAspectRatio="xMidYMid meet"
                        />
                      </div>
                      <span className="text-base font-semibold">Lead Tracker</span>
                    </span>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={classNames(
                                  pathname === item.href
                                    ? 'bg-gray-50 text-primary'
                                    : 'text-gray-600 hover:text-primary hover:bg-gray-50',
                                  'group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                                )}
                              >
                                <div className="flex h-6 w-6 items-center justify-center">
                                  <item.icon
                                    className={classNames(
                                      pathname === item.href
                                        ? 'text-primary'
                                        : 'text-gray-400 group-hover:text-primary',
                                      'h-5 w-5 flex-shrink-0 max-w-[20px] max-h-[20px]'
                                    )}
                                    aria-hidden="true"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    preserveAspectRatio="xMidYMid meet"
                                  />
                                </div>
                                <span>{item.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>

                      {/* Profile section */}
                      <li className="mt-auto border-t pt-3">
                        <Menu as="div" className="relative">
                          <Menu.Button className="flex w-full items-center gap-x-3 px-2 py-2 text-sm font-medium leading-6 text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200">
                            <div className="flex-shrink-0">
                              <Image
                                width={28}
                                height={28}
                                className="h-7 w-7 rounded-full bg-gray-50"
                                src={session?.user?.image || 'https://avatar.vercel.sh/user'}
                                alt=""
                              />
                            </div>
                            <span className="flex-1 text-left text-sm">
                              {session?.user?.name}
                            </span>
                            <div className="flex h-6 w-6 items-center justify-center">
                              <ArrowRightOnRectangleIcon 
                                className="h-5 w-5 flex-shrink-0 text-gray-400 max-w-[20px] max-h-[20px]"
                                width={20}
                                height={20}
                                viewBox="0 0 24 24"
                                preserveAspectRatio="xMidYMid meet"
                              />
                            </div>
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <Link
                                      href={item.href}
                                      onClick={item.onClick}
                                      className={classNames(
                                        active ? 'bg-gray-50' : '',
                                        'block px-3 py-1.5 text-sm leading-6 text-gray-700'
                                      )}
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex h-14 shrink-0 items-center border-b px-5">
            <span className="flex items-center gap-x-2">
              <div className="flex h-6 w-6 items-center justify-center">
                <ChartBarIcon 
                  className="h-5 w-5 flex-shrink-0 text-primary max-w-[20px] max-h-[20px]"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet"
                />
              </div>
              <span className="text-base font-semibold">Lead Tracker</span>
            </span>
          </div>
          <nav className="flex flex-1 flex-col px-5 pb-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? 'bg-gray-50 text-primary'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-50',
                          'group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                        )}
                      >
                        <div className="flex h-6 w-6 items-center justify-center">
                          <item.icon
                            className={classNames(
                              pathname === item.href
                                ? 'text-primary'
                                : 'text-gray-400 group-hover:text-primary',
                              'h-5 w-5 flex-shrink-0 max-w-[20px] max-h-[20px]'
                            )}
                            aria-hidden="true"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            preserveAspectRatio="xMidYMid meet"
                          />
                        </div>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Profile section */}
              <li className="mt-auto border-t pt-3">
                <Menu as="div" className="relative">
                  <Menu.Button className="flex w-full items-center gap-x-3 px-2 py-2 text-sm font-medium leading-6 text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <Image
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full bg-gray-50"
                        src={session?.user?.image || 'https://avatar.vercel.sh/user'}
                        alt=""
                      />
                    </div>
                    <span className="flex-1 text-left text-sm">
                      {session?.user?.name}
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center">
                      <ArrowRightOnRectangleIcon 
                        className="h-5 w-5 flex-shrink-0 text-gray-400 max-w-[20px] max-h-[20px]"
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        preserveAspectRatio="xMidYMid meet"
                      />
                    </div>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              onClick={item.onClick}
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1.5 text-sm leading-6 text-gray-700'
                              )}
                            >
                              {item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex h-14 items-center gap-x-4 border-b border-gray-200 bg-white px-4 sm:gap-x-6 sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <div className="flex h-5 w-5 items-center justify-center">
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </button>
        <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
          <div className="flex flex-1">
            <span className="flex items-center gap-x-2">
              <div className="flex h-5 w-5 items-center justify-center">
                <ChartBarIcon 
                  className="h-5 w-5 flex-shrink-0 text-primary max-w-[20px] max-h-[20px]"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet"
                />
              </div>
              <span className="text-sm font-semibold">Lead Tracker</span>
            </span>
          </div>
          <Link
            href="/settings"
            className="-m-1.5 p-1.5"
          >
            <span className="sr-only">Your profile</span>
            <div className="flex-shrink-0">
              <Image
                className="h-7 w-7 rounded-full bg-gray-50"
                src={session?.user?.image || 'https://avatar.vercel.sh/user'}
                alt=""
                width={28}
                height={28}
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
} 