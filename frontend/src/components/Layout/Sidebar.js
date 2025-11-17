import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  CalendarIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['student', 'faculty', 'admin', 'adviser'] },
  { name: 'Thesis Archive', href: '/thesis', icon: BookOpenIcon, roles: ['student', 'faculty', 'admin', 'adviser'] },
  { name: 'My Theses', href: '/my-theses', icon: DocumentTextIcon, roles: ['student', 'faculty', 'admin', 'adviser'] },
  { name: 'Submit Thesis', href: '/thesis/create', icon: AcademicCapIcon, roles: ['student', 'faculty'] },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon, roles: ['faculty', 'admin', 'adviser'] },
  { name: 'Profile', href: '/profile', icon: UsersIcon, roles: ['student', 'faculty', 'admin', 'adviser'] },
];

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: ChartBarIcon, roles: ['admin'] },
  { name: 'Manage Theses', href: '/admin/thesis', icon: ClipboardDocumentListIcon, roles: ['admin'] },
  { name: 'Manage Users', href: '/admin/users', icon: UserGroupIcon, roles: ['admin'] },
  { name: 'Departments', href: '/admin/departments', icon: BuildingOfficeIcon, roles: ['admin'] },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartPieIcon, roles: ['admin'] },
];

const adviserNavigation = [
  { name: 'Department Theses', href: '/adviser/theses', icon: ClipboardDocumentListIcon, roles: ['adviser'] },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const filteredAdminNavigation = adminNavigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const filteredAdviserNavigation = adviserNavigation.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                          <BookOpenIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <h1 className="text-lg font-semibold text-gray-900">
                          One Faith Archive
                        </h1>
                      </div>
                    </div>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {filteredNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={clsx(
                          location.pathname === item.href
                            ? 'bg-primary-100 text-primary-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={clsx(
                            location.pathname === item.href
                              ? 'text-primary-500'
                              : 'text-gray-400 group-hover:text-gray-500',
                            'mr-4 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                    
                    {filteredAdviserNavigation.length > 0 && (
                      <>
                        <div className="border-t border-gray-200 my-4"></div>
                        <div className="px-2">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Adviser
                          </h3>
                        </div>
                        {filteredAdviserNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={clsx(
                              location.pathname === item.href
                                ? 'bg-primary-100 text-primary-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon
                              className={clsx(
                                location.pathname === item.href
                                  ? 'text-primary-500'
                                  : 'text-gray-400 group-hover:text-gray-500',
                                'mr-4 flex-shrink-0 h-6 w-6'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </>
                    )}
                    
                    {filteredAdminNavigation.length > 0 && (
                      <>
                        <div className="border-t border-gray-200 my-4"></div>
                        <div className="px-2">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Administration
                          </h3>
                        </div>
                        {filteredAdminNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={clsx(
                              location.pathname === item.href
                                ? 'bg-primary-100 text-primary-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon
                              className={clsx(
                                location.pathname === item.href
                                  ? 'text-primary-500'
                                  : 'text-gray-400 group-hover:text-gray-500',
                                'mr-4 flex-shrink-0 h-6 w-6'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </>
                    )}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-semibold text-gray-900">
                      One Faith Archive
                    </h1>
                  </div>
                </div>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      location.pathname === item.href
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={clsx(
                        location.pathname === item.href
                          ? 'text-primary-500'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
                
                {filteredAdviserNavigation.length > 0 && (
                  <>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="px-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Adviser
                      </h3>
                    </div>
                    {filteredAdviserNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={clsx(
                          location.pathname === item.href
                            ? 'bg-primary-100 text-primary-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        )}
                      >
                        <item.icon
                          className={clsx(
                            location.pathname === item.href
                              ? 'text-primary-500'
                              : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
                
                {filteredAdminNavigation.length > 0 && (
                  <>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="px-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Administration
                      </h3>
                    </div>
                    {filteredAdminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={clsx(
                          location.pathname === item.href
                            ? 'bg-primary-100 text-primary-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        )}
                      >
                        <item.icon
                          className={clsx(
                            location.pathname === item.href
                              ? 'text-primary-500'
                              : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
