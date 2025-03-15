'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function StudentLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Login</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Student login is not implemented in this prototype.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            This prototype focuses on the teacher experience.
          </p>
        </div>
        
        <div className="mt-8">
          <Link 
            href="/login"
            className="flex items-center justify-center w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 