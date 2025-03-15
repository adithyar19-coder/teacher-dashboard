'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, User, CheckCircle, Clock, Zap, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
    submissionId: string;
  };
}

export default function SubmissionDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [classData, setClassData] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch class and submission data from localStorage
    const fetchData = () => {
      try {
        const savedClasses = localStorage.getItem('createdClasses');
        if (savedClasses) {
          const classes = JSON.parse(savedClasses);
          const foundClass = classes.find((cls: any) => cls.id === params.id);
          
          if (foundClass && foundClass.documents) {
            setClassData(foundClass);
            
            const foundSubmission = foundClass.documents.find(
              (doc: any) => doc.id === params.submissionId
            );
            
            if (foundSubmission) {
              setSubmission(foundSubmission);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, params.submissionId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!classData || !submission) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Link
            href={`/dashboard/classes/${params.id}/assignments`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Assignments
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Submission Not Found
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The submission you are looking for does not exist or has been deleted.
          </p>
          <Link
            href={`/dashboard/classes/${params.id}/assignments`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link
          href={`/dashboard/classes/${params.id}/assignments`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Assignments
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Submission Details
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Grading Feedback
              </h2>
              {submission.gradedBy && (
                <div className="flex items-center">
                  {submission.gradedBy === 'AI' ? (
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <Zap className="h-4 w-4 mr-1" />
                      <span className="text-sm">AI Graded</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span className="text-sm">Teacher Graded</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-6">
              {submission.graded ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        Graded
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {submission.grade}/100
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Feedback
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md text-gray-700 dark:text-gray-300">
                      {submission.feedback || "No feedback provided."}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Graded On
                      </h3>
                      <div className="text-gray-600 dark:text-gray-400">
                        {new Date(submission.gradedAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Graded By
                      </h3>
                      <div className="text-gray-600 dark:text-gray-400">
                        {submission.gradedBy === 'AI' ? (
                          <span className="inline-flex items-center">
                            <Zap className="h-4 w-4 mr-1 text-blue-500" />
                            AI Grading System
                          </span>
                        ) : (
                          <span className="inline-flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1 text-green-500" />
                            Teacher
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    Not Graded Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    This submission has not been graded yet. Please grade it from the assignments page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Submission Info
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student
                </h3>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {submission.studentName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      student@example.com
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document
                </h3>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {submission.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {(submission.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Submitted On
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(submission.uploadedAt).toLocaleString()}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Class
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {classData.name}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={`/dashboard/classes/${params.id}/assignments`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to all submissions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 