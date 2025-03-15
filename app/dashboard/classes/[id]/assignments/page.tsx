'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, User, Zap, CheckCircle, Clock, MessageSquare, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ClassAssignmentsPage({ params }: PageProps) {
  const router = useRouter();
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gradingStatus, setGradingStatus] = useState<Record<string, boolean>>({});
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    documentId: string;
    feedback: string;
    grade: string;
  } | null>(null);
  
  useEffect(() => {
    // Fetch class data from localStorage
    const fetchClassData = () => {
      try {
        const savedClasses = localStorage.getItem('createdClasses');
        if (savedClasses) {
          const classes = JSON.parse(savedClasses);
          const foundClass = classes.find((cls: any) => cls.id === params.id);
          
          if (foundClass) {
            setClassData(foundClass);
          }
        }
      } catch (error) {
        console.error('Error loading class data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClassData();
  }, [params.id]);
  
  const handleAIGrading = (documentId: string) => {
    // Find the document to grade
    const documentToGrade = classData.documents.find((doc: any) => doc.id === documentId);
    
    if (!documentToGrade) return;
    
    // Set grading status for this document
    setGradingStatus((prev) => ({ ...prev, [documentId]: true }));
    
    // Simulate AI grading process with a timeout
    setTimeout(() => {
      // Generate random grade between 70 and 100
      const grade = Math.floor(Math.random() * 31) + 70;
      
      // Generate feedback based on grade
      let feedback = '';
      if (grade >= 90) {
        feedback = "Excellent work! The submission demonstrates a thorough understanding of the concepts and applies them correctly. The structure is clear and the arguments are well-supported.";
      } else if (grade >= 80) {
        feedback = "Good work. The submission shows a solid understanding of most concepts. There are a few areas that could be improved, but overall the work is of high quality.";
      } else {
        feedback = "Satisfactory work. The submission demonstrates basic understanding of the concepts but lacks depth in some areas. Consider revisiting the key topics and providing more detailed explanations.";
      }
      
      // Update the document with grading information
      const updatedDocuments = classData.documents.map((doc: any) => {
        if (doc.id === documentId) {
          return {
            ...doc,
            graded: true,
            grade,
            feedback,
            gradedAt: new Date().toISOString(),
            gradedBy: 'AI' // Add this field to indicate AI grading
          };
        }
        return doc;
      });
      
      // Update the class data with the new documents
      const updatedClass = {
        ...classData,
        documents: updatedDocuments
      };
      
      // Update localStorage
      try {
        const savedClasses = localStorage.getItem('createdClasses');
        if (savedClasses) {
          const classes = JSON.parse(savedClasses);
          const updatedClasses = classes.map((cls: any) => 
            cls.id === classData.id ? updatedClass : cls
          );
          localStorage.setItem('createdClasses', JSON.stringify(updatedClasses));
        }
        
        // Update state
        setClassData(updatedClass);
        setGradingStatus((prev) => ({ ...prev, [documentId]: false }));
      } catch (error) {
        console.error('Error saving AI grading results:', error);
        setGradingStatus((prev) => ({ ...prev, [documentId]: false }));
      }
    }, 2000); // Simulate 2 second processing time
  };
  
  const openFeedbackModal = (documentId: string) => {
    setFeedbackModal({
      isOpen: true,
      documentId,
      feedback: '',
      grade: '80'
    });
  };
  
  const closeFeedbackModal = () => {
    setFeedbackModal(null);
  };
  
  const handleFeedbackSubmit = () => {
    if (!feedbackModal) return;
    
    const { documentId, feedback, grade } = feedbackModal;
    
    // Find the document and update it with feedback
    const updatedDocuments = classData.documents.map((doc: any) => {
      if (doc.id === documentId) {
        return {
          ...doc,
          graded: true,
          grade: parseInt(grade),
          feedback,
          gradedAt: new Date().toISOString(),
          gradedBy: 'Teacher' // Add this field to indicate teacher grading
        };
      }
      return doc;
    });
    
    // Update the class data with the new documents
    const updatedClass = {
      ...classData,
      documents: updatedDocuments
    };
    
    // Update localStorage
    try {
      const savedClasses = localStorage.getItem('createdClasses');
      if (savedClasses) {
        const classes = JSON.parse(savedClasses);
        const updatedClasses = classes.map((cls: any) => 
          cls.id === classData.id ? updatedClass : cls
        );
        localStorage.setItem('createdClasses', JSON.stringify(updatedClasses));
      }
      
      // Update state
      setClassData(updatedClass);
      setFeedbackModal(null);
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!classData) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Link
            href="/dashboard/classes"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Classes
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Class Not Found
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The class you are looking for does not exist or has been deleted.
          </p>
          <Link
            href="/dashboard/classes"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Go to Classes
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link
          href="/dashboard/classes"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Classes
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {classData.name} - Student Submissions
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Student Submissions
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and grade student submissions for this class.
          </p>
        </div>
        
        {classData.documents && classData.documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Submitted
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
                {classData.documents.map((doc: any, index: number) => (
                  <tr key={doc.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {doc.studentName || `Student ${index + 1}`}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            student{index + 1}@example.com
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {doc.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {(doc.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(doc.uploadedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.graded ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Graded: {doc.grade}/100
                          {doc.gradedBy && (
                            <span className="ml-1 text-xs opacity-75">({doc.gradedBy})</span>
                          )}
                        </span>
                      ) : gradingStatus[doc.id] ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          <Clock className="h-3 w-3 mr-1 animate-spin" />
                          Grading...
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {doc.graded ? (
                        <Link
                          href={`/dashboard/classes/${params.id}/submissions/${doc.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View Feedback
                        </Link>
                      ) : gradingStatus[doc.id] ? (
                        <span className="text-gray-400 cursor-not-allowed">
                          Processing...
                        </span>
                      ) : (
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => openFeedbackModal(doc.id)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Give Feedback
                          </button>
                          <button
                            onClick={() => handleAIGrading(doc.id)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            AI Grade
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No student submissions found for this class.
            </p>
          </div>
        )}
      </div>
      
      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Provide Feedback
              </h2>
              <button
                onClick={closeFeedbackModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade (0-100)
                </label>
                <input
                  type="number"
                  id="grade"
                  min="0"
                  max="100"
                  value={feedbackModal.grade}
                  onChange={(e) => setFeedbackModal({
                    ...feedbackModal,
                    grade: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Feedback
                </label>
                <textarea
                  id="feedback"
                  rows={6}
                  value={feedbackModal.feedback}
                  onChange={(e) => setFeedbackModal({
                    ...feedbackModal,
                    feedback: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your feedback here..."
                ></textarea>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={closeFeedbackModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 