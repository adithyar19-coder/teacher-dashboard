'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { 
  getAssignmentById, 
  getSubmissionsForAssignment, 
  getStudentById,
  getClassById
} from '@/lib/mockData';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

export default function SubmissionsPage({ params }: PageProps) {
  const { user } = useAuth();
  const router = useRouter();
  
  if (!user) {
    return null;
  }
  
  const assignment = getAssignmentById(params.id);
  
  if (!assignment || assignment.createdBy !== user.id) {
    // Redirect if assignment doesn't exist or doesn't belong to this teacher
    router.push('/dashboard/assignments');
    return null;
  }
  
  const classData = getClassById(assignment.classId);
  const submissions = getSubmissionsForAssignment(params.id);
  
  // Enhance submissions with student data
  const enhancedSubmissions = submissions.map(submission => {
    const student = getStudentById(submission.studentId);
    return {
      ...submission,
      student: {
        name: student?.name || 'Unknown Student',
        email: student?.email || 'unknown@example.com'
      }
    };
  });
  
  // Helper function to format date
  const formatDate = (dateString: Date) => {
    return dateString.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link
          href="/dashboard/assignments"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Assignments
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Submissions
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {assignment.title}
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <p>Class: {classData?.name || 'Unknown Class'}</p>
          <p>Due Date: {formatDate(assignment.dueDate)}</p>
          <p>Total Points: {assignment.totalPoints}</p>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <p>{assignment.description}</p>
        </div>
      </div>
      
      {enhancedSubmissions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
            No submissions yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no student submissions for this assignment yet.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    AI Grade
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {enhancedSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {submission.student.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {submission.student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Clock className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                        {formatDate(submission.submittedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.status === 'submitted' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Needs Grading
                        </span>
                      ) : submission.status === 'graded' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Graded
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Returned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {submission.grade !== undefined ? (
                          `${submission.grade} / ${assignment.totalPoints}`
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">Not graded</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {submission.aiGrade !== undefined ? (
                          `${submission.aiGrade} / ${assignment.totalPoints}`
                        ) : (
                          <button
                            className="inline-flex items-center text-xs font-medium text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
                            onClick={() => {
                              // This would be handled by client-side JavaScript
                              // We're just showing the UI here
                            }}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Generate AI Grade
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/dashboard/assignments/${assignment.id}/submissions/${submission.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View & Grade
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