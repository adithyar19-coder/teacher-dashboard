'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherLoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Immediately redirect to the dashboard without any authentication
    router.push('/dashboard');
  }, [router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Login</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
          <div className="mt-4 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 