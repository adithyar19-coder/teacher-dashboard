import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Users, 
  FileText, 
  BarChart, 
  Settings, 
  LogOut,
  Home
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Classes',
      href: '/dashboard/classes',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: 'Students',
      href: '/dashboard/students',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Assignments',
      href: '/dashboard/assignments',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex items-center justify-center rounded-md bg-blue-600 p-1.5 text-white">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="h-5 w-5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" 
              />
            </svg>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">
            Teacher Dashboard
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/api/auth/signout"
          className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Sign Out</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 