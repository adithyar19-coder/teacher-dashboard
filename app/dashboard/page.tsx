'use client';

import React from 'react';
import { 
  getClassesForTeacher, 
  getStudentsForTeacher, 
  getAssignmentsForTeacher,
  getSubmissionsForAssignment
} from '@/lib/mockData';
import { 
  BookOpen, 
  Users, 
  FileText, 
  CheckCircle,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  // Mock user ID for demonstration
  const userId = "teacher1";
  
  // Get stats from mock data
  const classes = getClassesForTeacher(userId);
  const students = getStudentsForTeacher(userId);
  const assignments = getAssignmentsForTeacher(userId);
  
  // Count submissions and pending submissions
  let submissionsCount = 0;
  let pendingSubmissionsCount = 0;
  
  assignments.forEach(assignment => {
    const submissions = getSubmissionsForAssignment(assignment.id);
    submissionsCount += submissions.length;
    pendingSubmissionsCount += submissions.filter(sub => sub.status === 'submitted').length;
  });
  
  const stats = {
    classesCount: classes.length,
    studentsCount: students.length,
    assignmentsCount: assignments.length,
    submissionsCount,
    pendingSubmissionsCount
  };
  
  const statCards = [
    {
      title: 'Classes',
      value: stats.classesCount,
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Students',
      value: stats.studentsCount,
      icon: <Users className="h-8 w-8 text-green-500" />,
      color: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Assignments',
      value: stats.assignmentsCount,
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Submissions',
      value: stats.submissionsCount,
      icon: <CheckCircle className="h-8 w-8 text-amber-500" />,
      color: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      title: 'Pending Grading',
      value: stats.pendingSubmissionsCount,
      icon: <Clock className="h-8 w-8 text-red-500" />,
      color: 'bg-red-50 dark:bg-red-900/20',
    },
  ];
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, Teacher
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's an overview of your teaching activity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card) => (
          <div 
            key={card.title}
            className={`${card.color} p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              No recent activity to display.
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Deadlines
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              No upcoming deadlines to display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 