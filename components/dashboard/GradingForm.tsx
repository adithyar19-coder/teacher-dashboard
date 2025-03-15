'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AIGradeButton from './AIGradeButton';
import { updateSubmission } from '@/lib/mockData';

interface GradingFormProps {
  submissionId: string;
  assignmentId: string;
  totalPoints: number;
  initialGrade?: number;
  initialFeedback?: string;
  initialStatus?: 'submitted' | 'graded' | 'returned';
  initialAIGrade?: number;
  initialAIFeedback?: string;
}

const GradingForm: React.FC<GradingFormProps> = ({
  submissionId,
  assignmentId,
  totalPoints,
  initialGrade,
  initialFeedback,
  initialStatus = 'submitted',
  initialAIGrade,
  initialAIFeedback,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grade, setGrade] = useState<number | undefined>(initialGrade);
  const [feedback, setFeedback] = useState<string | undefined>(initialFeedback);
  const [status, setStatus] = useState<string>(initialStatus);
  const [aiGrade, setAIGrade] = useState<number | undefined>(initialAIGrade);
  const [aiFeedback, setAIFeedback] = useState<string | undefined>(initialAIFeedback);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // For the prototype, we'll update the mock data directly
      updateSubmission(submissionId, {
        grade,
        feedback,
        status: status as 'submitted' | 'graded' | 'returned',
      });

      // Refresh the page to show updated data
      router.refresh();
      
      // Show success message
      alert('Grading saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIGradeGenerated = (newAIGrade: number, newAIFeedback: string) => {
    setAIGrade(newAIGrade);
    setAIFeedback(newAIFeedback);
    
    // Optionally, you can also set the manual grade to the AI grade
    // setGrade(newAIGrade);
    // setFeedback(newAIFeedback);
  };

  const useAIGrade = () => {
    if (aiGrade !== undefined && aiFeedback) {
      setGrade(aiGrade);
      setFeedback(aiFeedback);
    }
  };

  return (
    <div className="space-y-8">
      {/* AI Grading Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Grading
          </h2>
          {!aiGrade && (
            <AIGradeButton 
              submissionId={submissionId} 
              onGradeGenerated={handleAIGradeGenerated} 
            />
          )}
        </div>
        
        {aiGrade ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">AI Score:</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {aiGrade} / {totalPoints}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AI Feedback:
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md text-gray-600 dark:text-gray-400 text-sm">
                {aiFeedback}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={useAIGrade}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Use AI Grade & Feedback
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No AI grading has been generated yet. Click the button above to generate an AI grade.
          </p>
        )}
      </div>
      
      {/* Manual Grading Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Manual Grading
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="grade" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Grade (out of {totalPoints})
            </label>
            <input
              type="number"
              id="grade"
              name="grade"
              min="0"
              max={totalPoints}
              value={grade || ''}
              onChange={(e) => setGrade(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label 
              htmlFor="feedback" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows={6}
              value={feedback || ''}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Provide feedback to the student"
            ></textarea>
          </div>
          
          <div>
            <label 
              htmlFor="status" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="returned">Returned to Student</option>
            </select>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              Error: {error}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Grading'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradingForm; 