'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { 
  getAssignmentById, 
  getSubmission, 
  getStudentById,
  getClassById
} from '@/lib/mockData';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import GradingForm from '@/components/dashboard/GradingForm';

interface PageProps {
  params: {
    id: string;
    submissionId: string;
  };
}

export default function SubmissionDetailPage({ params }: PageProps) {
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
  
  const submission = getSubmission(params.submissionId);
  
  if (!submission || submission.assignmentId !== params.id) {
    // Redirect if submission doesn't exist or doesn't belong to this assignment
    router.push(`/dashboard/assignments/${params.id}/submissions`);
    return null;
  }
  
  const classData = getClassById(assignment.classId);
  const student = getStudentById(submission.studentId);
  
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
          href={`/dashboard/assignments/${assignment.id}/submissions`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Submissions
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Student Submission
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Assignment Details */}
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
          
          {/* Submission Content */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Submission
              </h2>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                Submitted: {formatDate(submission.submittedAt)}
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap">{submission.content}</pre>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Student Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Student Information
            </h2>
            <div className="space-y-2">
              <p className="text-gray-900 dark:text-white font-medium">
                {student?.name || 'Unknown Student'}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {student?.email || 'unknown@example.com'}
              </p>
            </div>
          </div>
          
          {/* Grading Form */}
          <GradingForm 
            submissionId={submission.id}
            assignmentId={assignment.id}
            totalPoints={assignment.totalPoints}
            initialGrade={submission.grade}
            initialFeedback={submission.feedback}
            initialStatus={submission.status}
            initialAIGrade={submission.aiGrade}
            initialAIFeedback={submission.aiFeedback}
          />
        </div>
      </div>
    </div>
  );
} 