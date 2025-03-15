'use client';

import React from 'react';
import Link from 'next/link';
import { UserCircle, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Login to Automated Grading System</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Choose your account type</p>
        </div>
        
        <div className="mt-8 space-y-4">
          <Link 
            href="/login/teacher"
            className="flex items-center justify-center w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <UserCircle className="w-5 h-5 mr-2" />
            Login as Teacher
          </Link>
          
          <Link 
            href="/login/student"
            className="flex items-center justify-center w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            Login as Student
          </Link>
        </div>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            For this prototype, no actual authentication is required.
            <br />
            Simply click on the role you want to use.
          </p>
        </div>
      </div>
    </div>
  );
} 