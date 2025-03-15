'use client';

import React from 'react';
import { getAssignmentsForTeacher, getClassById } from '@/lib/mockData';
import Link from 'next/link';
import { Plus, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AssignmentsPage() {
  // Mock user ID for demonstration
  const userId = "teacher1";
  
  const assignments = getAssignmentsForTeacher(userId);
  
  // Enhance assignments with class data
  const enhancedAssignments = assignments.map(assignment => {
    const classData = getClassById(assignment.classId);
    return {
      ...assignment,
      class: {
        name: classData?.name || 'Unknown Class',
        classCode: classData?.classCode || 'N/A'
      },
      // Add a default status if it doesn't exist
      status: assignment.hasOwnProperty('status') ? assignment.status : 'active'
    };
  });
  
  // Helper function to format date
  const formatDate = (dateString: Date) => {
    return dateString.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Helper function to check if assignment is past due
  const isPastDue = (dueDate: Date) => {
    const now = new Date();
    return now > dueDate;
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Assignments
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and track assignments across all your classes
          </p>
        </div>
        
        <Link
          href="/dashboard/assignments/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="h-5 w-5 mr-1" />
          Create Assignment
        </Link>
      </div>
      
      {enhancedAssignments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Assignments Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't created any assignments yet. Get started by creating your first assignment.
          </p>
          <Link
            href="/dashboard/assignments/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" />
            Create Assignment
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {enhancedAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {assignment.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {assignment.description.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {assignment.class.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Code: {assignment.class.classCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(assignment.dueDate)}
                        </span>
                      </div>
                      {isPastDue(assignment.dueDate) && (
                        <div className="flex items-center text-red-500 mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Past due</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        assignment.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {assignment.status === 'active' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/assignments/${assignment.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/assignments/${assignment.id}/submissions`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Submissions
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 